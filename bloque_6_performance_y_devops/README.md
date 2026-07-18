# Bloque 6: Rendimiento, Testing de Carga y DevOps (Días 81-100)

## 🧠 Teoría Profunda

### Profiling de CPU y Memoria
No se debe optimizar por intuición. Un análisis cuantitativo previo es indispensable para identificar cuellos de botella.
*   `cProfile`: Profiler determinista integrado. Mide el tiempo de CPU consumido por cada función. Su costo es alto y puede distorsionar las métricas en aplicaciones IO-bound.
*   `memory_profiler`: Analiza el uso de memoria a nivel de línea de código. Ideal para detectar fugas de memoria persistentes en demonios y workers en producción.
*   `py-spy`: Un profiler de muestreo de impacto extremadamente bajo escrito en Rust. Lee directamente el espacio de memoria del intérprete de Python mediante llamadas del sistema operativo, permitiendo generar diagramas de llama (*Flame Graphs*) de aplicaciones activas en producción sin degradar su rendimiento.

### Estrategias de Aceleración y Optimización
*   **Cython:** Compila código de Python tipado estáticamente a extensiones nativas de C.
*   **Numba:** Traduce funciones matemáticas en código máquina optimizado en tiempo de ejecución (JIT) usando LLVM.
*   **PyPy:** Reemplazo directo del intérprete CPython. Su JIT rastrea la ejecución de código dinámico y lo compila a bajo nivel para acelerarlo considerablemente en bucles de larga duración.

### Caching Distribuido
*   Implementación de caché compartida (Redis, Memcached) para evitar operaciones costosas redundantes.
*   Patrón **Cache-Aside:** La aplicación consulta primero en caché. Si hay un fallo (*cache miss*), consulta a la base de datos y almacena el resultado en caché.

### DevOps y Observabilidad
*   **OpenTelemetry:** Recopila trazas distribuidas y telemetría de forma neutral para entender cómo fluyen las peticiones entre microservicios concurrentes.
*   **Canary Deployments:** Despliegue progresivo que expone la nueva versión a un porcentaje minoritario de usuarios para mitigar riesgos en caso de fallos.

---

## 🛠️ Contraste de Código

### ❌ Código Ineficiente (Cálculos complejos secuenciales en Python)
```python
# Bucle de cálculo pesado interpretado línea a línea por CPython
def simular_difusion_lenta(matriz, iteraciones):
    filas, cols = matriz.shape
    for _ in range(iteraciones):
        nueva = matriz.copy()
        for i in range(1, filas - 1):
            for j in range(1, cols - 1):
                nueva[i, j] = 0.25 * (
                    matriz[i+1, j] + matriz[i-1, j] +
                    matriz[i, j+1] + matriz[i, j-1]
                )
        matriz = nueva
    return matriz
```

### Enfoque Optimizado (Uso de Numba JIT para compilación a máquina nativa)
```python
from numba import jit
import numpy as np

# El decorador jit compila la lógica a C nativo al ejecutarse la primera vez
@jit(nopython=True, fastmath=True)
def simular_difusion_rapida(matriz: np.ndarray, iteraciones: int) -> np.ndarray:
    filas, cols = matriz.shape
    for _ in range(iteraciones):
        nueva = matriz.copy()
        for i in range(1, filas - 1):
            for j in range(1, cols - 1):
                nueva[i, j] = 0.25 * (
                    matriz[i+1, j] + matriz[i-1, j] +
                    matriz[i, j+1] + matriz[i, j-1]
                )
        matriz = nueva
    return matriz
```

---

## 📋 Práctica Obligatoria y Ejercicios
1.  **Pruebas de Carga a Escala:**
    *   Escribe escenarios de prueba dinámicos simulando cargas de usuarios con la herramienta **Locust** en Python.
    *   Somete la API desarrollada a una carga incremental hasta encontrar el punto de saturación de sockets de base de datos.
2.  **Optimización Extrema:**
    *   Identifica cuellos de botella con `py-spy` y corrígelos mediante caché en Redis o compilando funciones críticas con Numba.

---

## 📦 Entregable del Bloque
*   Un reporte detallado en Markdown comparando la latencia (p95 y p99) y las peticiones por segundo (RPS) de la API antes y después de aplicar optimizaciones.
*   Un flujo de integración continua en **GitHub Actions** (`.github/workflows/ci.yml`) que automatice la ejecución de linters, análisis de seguridad estático (`Bandit`/`Safety`), y el conjunto de pruebas unitarias.

---

## 📚 Recursos Recomendados
*   **Libro:** *High Performance Python* (Micha Gorelick & Ian Ozsvald).
*   **Documentación:** Guías de instrumentación de OpenTelemetry para Python.
*   **Charla PyCon:** "PySpy: A Sampling Profiler for Python" por Ben Frederickson.

---

## ✅ Validación de Conocimientos
* [ ] Explicar teóricamente la diferencia entre optimizar la latencia vs el rendimiento global (*throughput*) de un sistema web.
* [ ] Configurar instrumentación automática de trazas usando OpenTelemetry y exportar los datos a una interfaz gráfica de Jaeger.
* [ ] Configurar políticas de reintento con retroceso exponencial (*exponential backoff*) y disyuntor (*circuit breaker*) ante fallos de APIs externas.

---

## ⚠️ Advertencias de Seniors
> [!WARNING]
> **Error de Senior:** Reemplazar CPython por PyPy o reescribir módulos completos en Cython sin antes haber optimizado los algoritmos, simplificado las estructuras de datos y eliminado consultas N+1 a bases de datos. La optimización algorítmica siempre precede a la compilación nativa.
