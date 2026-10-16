import sys
import subprocess
import tempfile
import os
import ast
import time

# Lista blanca de atributos dunder permitidos con fines legítimos de POO
ALLOWED_DUNDERS = {
    "__init__", "__str__", "__repr__", "__len__", "__getitem__",
    "__setitem__", "__delitem__", "__iter__", "__next__", "__enter__",
    "__exit__", "__eq__", "__lt__", "__gt__", "__le__", "__ge__",
    "__ne__", "__add__", "__sub__", "__mul__", "__truediv__",
    "__floordiv__", "__mod__", "__pow__", "__name__", "__doc__"
}

FORBIDDEN_MODULES = {
    "os", "sys", "subprocess", "shutil", "socket", "urllib", "requests",
    "builtins", "posix", "nt", "importlib", "commands", "pty", "traceback"
}

FORBIDDEN_CALLS = {
    "eval", "exec", "__import__", "compile", "breakpoint"
}

def validate_python_code_ast(code: str) -> tuple[bool, str]:
    """
    Inspecciona el AST del código del alumno para prevenir ataques de RCE,
    bypasses mediante introspección de clases (__subclasses__) o llamadas peligrosas.
    """
    try:
        tree = ast.parse(code)
    except SyntaxError as e:
        return False, f"Error de Sintaxis en línea {e.lineno}: {e.msg}"

    for node in ast.walk(tree):
        # 1. Bloqueo de importaciones maliciosas
        if isinstance(node, ast.Import):
            for alias in node.names:
                root_module = alias.name.split(".")[0]
                if root_module in FORBIDDEN_MODULES:
                    return False, f"Violación de Seguridad: El módulo '{root_module}' está restringido en el entorno didáctico."
        elif isinstance(node, ast.ImportFrom):
            if node.module and node.module.split(".")[0] in FORBIDDEN_MODULES:
                return False, f"Violación de Seguridad: La importación desde '{node.module}' está restringida."

        # 2. Bloqueo de llamadas peligrosas
        elif isinstance(node, ast.Call):
            if isinstance(node.func, ast.Name):
                if node.func.id in FORBIDDEN_CALLS:
                    return False, f"Violación de Seguridad: La función '{node.func.id}()' está deshabilitada en el Sandbox."
            elif isinstance(node.func, ast.Attribute):
                if node.func.attr == "system" or node.func.attr == "popen":
                    return False, "Violación de Seguridad: Llamadas a ejecución de sistema detectadas y bloqueadas."

        # 3. Hardening de Dunders (Anti __subclasses__ / BuiltinImporter escape)
        elif isinstance(node, ast.Attribute):
            if node.attr.startswith("__") and node.attr not in ALLOWED_DUNDERS:
                return False, f"Violación de Seguridad: Acceso restringido al atributo dunder '{node.attr}'."

    return True, ""

def limit_child_process_resources():
    """
    Aplica límites de kernel con setrlimit en entornos Linux (Render)
    para impedir agotamiento de RAM o Fork Bombs.
    """
    try:
        import resource
        # Máximo 48 MB de memoria virtual
        resource.setrlimit(resource.RLIMIT_AS, (48 * 1024 * 1024, 48 * 1024 * 1024))
        # Máximo 3 segundos de CPU
        resource.setrlimit(resource.RLIMIT_CPU, (3, 3))
        # Impedir forks y subprocesos
        resource.setrlimit(resource.RLIMIT_NPROC, (0, 0))
        # Máximo 512 KB de archivo escrito
        resource.setrlimit(resource.RLIMIT_FSIZE, (512 * 1024, 512 * 1024))
    except (ImportError, Exception):
        pass

def run_python_code(code: str, test_code: str = "", timeout: float = 3.0) -> dict:
    """
    Ejecuta un bloque de código Python de forma aislada, segura y con métricas de rendimiento.
    """
    # Validación previa con AST
    is_valid, error_msg = validate_python_code_ast(code)
    if not is_valid:
        return {
            "passed": False,
            "stdout": "",
            "stderr": f"🛡️ [SANDBOX SHIELD] {error_msg}",
            "exit_code": -1,
            "metrics": {"elapsed_ms": 0, "status": "blocked"}
        }

    # Envoltorio para medir tiempo de ejecución y memoria en CPython
    profiled_harness = f"""
import sys, time, tracemalloc

tracemalloc.start()
_t0 = time.perf_counter_ns()

try:
{chr(10).join('    ' + line for line in code.splitlines())}

{chr(10).join('    ' + line for line in test_code.splitlines()) if test_code else ''}

    _elapsed_ms = round((time.perf_counter_ns() - _t0) / 1_000_000.0, 3)
    _current_mem, _peak_mem = tracemalloc.get_traced_memory()
    tracemalloc.stop()
    print(f"\\n__METRICS_LINE__|{{_elapsed_ms}}|{{round(_peak_mem / 1024.0, 2)}}")
except Exception as _ex:
    tracemalloc.stop()
    raise _ex
"""

    with tempfile.NamedTemporaryFile("w", suffix=".py", delete=False, encoding="utf-8") as temp_file:
        temp_file.write(profiled_harness)
        temp_path = temp_file.name

    start_real = time.perf_counter()
    try:
        preexec = limit_child_process_resources if os.name != "nt" else None
        process = subprocess.run(
            [sys.executable, temp_path],
            capture_output=True,
            text=True,
            timeout=timeout,
            preexec_fn=preexec
        )
        elapsed_real_ms = round((time.perf_counter() - start_real) * 1000, 2)
        passed = (process.returncode == 0)

        clean_stdout = process.stdout
        profile_stats = {"elapsed_ms": elapsed_real_ms, "peak_mem_kb": 0.0}

        if "__METRICS_LINE__|" in clean_stdout:
            parts = clean_stdout.split("__METRICS_LINE__|")
            clean_stdout = parts[0].strip()
            if len(parts) > 1:
                metrics_data = parts[1].strip().split("|")
                if len(metrics_data) == 2:
                    try:
                        profile_stats["elapsed_ms"] = float(metrics_data[0])
                        profile_stats["peak_mem_kb"] = float(metrics_data[1])
                    except ValueError:
                        pass

        # Agregar sello de rendimiento pedagógico si pasa las pruebas
        if passed:
            speed_tier = "⚡ Ultrarrápido (< 5ms)" if profile_stats["elapsed_ms"] < 5 else "✅ Óptimo"
            clean_stdout += f"\n\n[Métricas Big-O & Profiler]: Tiempo: {profile_stats['elapsed_ms']}ms ({speed_tier}) | Memoria Peak: {profile_stats['peak_mem_kb']} KB"

        return {
            "passed": passed,
            "stdout": clean_stdout,
            "stderr": process.stderr,
            "exit_code": process.returncode,
            "metrics": profile_stats
        }
    except subprocess.TimeoutExpired:
        return {
            "passed": False,
            "stdout": "",
            "stderr": "Tiempo de ejecución excedido (Timeout > 3s). Revisa si tienes bucles infinitos (while True) o recursión sin caso base.",
            "exit_code": -1,
            "metrics": {"elapsed_ms": 3000, "status": "timeout"}
        }
    except Exception as e:
        return {
            "passed": False,
            "stdout": "",
            "stderr": f"Error del sistema al ejecutar: {str(e)}",
            "exit_code": -1,
            "metrics": {"elapsed_ms": 0, "status": "error"}
        }
    finally:
        if os.path.exists(temp_path):
            try:
                os.remove(temp_path)
            except Exception:
                pass
