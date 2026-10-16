import sys
import subprocess
import tempfile
import os

def run_python_code(code: str, test_code: str = "", timeout: float = 3.0) -> dict:
    """
    Ejecuta un bloque de código Python de forma aislada y captura stdout, stderr y resultado de pruebas.
    """
    full_code = code + "\n\n" + test_code if test_code else code

    with tempfile.NamedTemporaryFile("w", suffix=".py", delete=False, encoding="utf-8") as temp_file:
        temp_file.write(full_code)
        temp_path = temp_file.name

    try:
        process = subprocess.run(
            [sys.executable, temp_path],
            capture_output=True,
            text=True,
            timeout=timeout
        )
        passed = (process.returncode == 0)
        return {
            "passed": passed,
            "stdout": process.stdout,
            "stderr": process.stderr,
            "exit_code": process.returncode
        }
    except subprocess.TimeoutExpired:
        return {
            "passed": False,
            "stdout": "",
            "stderr": "Tiempo de ejecución excedido (Timeout > 3s). Revisa si tienes bucles infinitos.",
            "exit_code": -1
        }
    except Exception as e:
        return {
            "passed": False,
            "stdout": "",
            "stderr": f"Error del sistema al ejecutar: {str(e)}",
            "exit_code": -1
        }
    finally:
        if os.path.exists(temp_path):
            try:
                os.remove(temp_path)
            except Exception:
                pass
