# Bloque 3: Concurrencia y Paralelismo Real (Días 31-45)

## 🧠 Teoría Profunda

### Concurrencia vs Paralelismo
*   **Concurrencia:** Estructurar un programa para lidiar con múltiples tareas lógicas. Varias tareas progresan de forma alternada (single core con cambio de contexto rápido).
*   **Paralelismo:** Ejecución simultánea física de múltiples tareas. Requiere hardware multinúcleo para ejecutarse en paralelo real.

### Hilos (`threading`) vs Procesos (`multiprocessing`)
*   **Threading:** Comparte el mismo espacio de memoria global. Debido al GIL, solo es apto para tareas I/O-bound (como consumir APIs web o leer de disco). El GIL se libera durante las llamadas de red o bloqueos de E/S.
*   **Multiprocessing:** Levanta intérpretes de Python independientes en procesos del sistema operativo. Al tener cada proceso su propio GIL, permite paralelismo real en tareas de cálculo intensivo (CPU-bound). Sin embargo, consume mucha más memoria y la comunicación entre procesos (IPC) requiere serializar los objetos con el módulo `pickle`.

### Asyncio (Asincronía Cooperativa)
*   **Mecanismo:** Un único hilo de ejecución coordinado por un bucle de eventos (*Event Loop*).
*   **Cooperativo:** Las tareas ceden voluntariamente el control al Event Loop cuando se encuentran bloqueadas esperando E/S mediante la expresión `await`.
*   **Estructuras de Asyncio:**
    *   *Corrutinas:* Declaradas con `async def`. Retornan un objeto corrutina diferido.
    *   *Tasks:* Envuelven corrutinas y las programan para ejecutarse de forma concurrente en el Event Loop.
    *   *Futures:* Representan el resultado de una operación que aún no se ha completado.

---

## 🛠️ Contraste de Código

### ❌ Código Ineficiente (Peticiones I/O síncronas bloqueantes en bucles)
```python
import requests
import time

# Peticiones en serie: la CPU permanece ociosa esperando respuestas de red
def consultar_apis_lento(urls):
    respuestas = []
    for url in urls:
        r = requests.get(url)  # Bloquea el hilo actual por completo
        respuestas.append(r.json())
    return respuestas
```

### Enfoque Optimizado (Asyncio con aiohttp y control de semáforos)
```python
import asyncio
import aiohttp
from typing import List, Dict

# Concurrencia asíncrona no bloqueante con límite de peticiones simultáneas
async def hacer_peticion(session: aiohttp.ClientSession, url: str, semaforo: asyncio.Semaphore) -> Dict:
    async with semaforo:  # Controla la tasa de peticiones simultáneas
        async with session.get(url) as response:
            return await response.json()

async def consultar_apis_rapido(urls: List[str]) -> List[Dict]:
    semaforo = asyncio.Semaphore(10)  # Límite máximo de sockets abiertos
    async with aiohttp.ClientSession() as session:
        tareas = [
            asyncio.create_task(hacer_peticion(session, url, semaforo))
            for url in urls
        ]
        return await asyncio.gather(*tareas)
```

---

## 📋 Práctica Obligatoria y Ejercicios
1.  **Benchmark de Scraper Masivo:**
    *   Descarga 10,000 URLs en serie, hilos, procesos y `asyncio` + `aiohttp`.
    *   Mide el uso de recursos y genera gráficos con `matplotlib` mostrando latencia vs número de sockets concurrentes.

---

## 📦 Entregable del Bloque
Scripts modulares que incluyan:
*   Un sistema de logging estructurado que exporte los eventos en formato JSON estructurado.
*   Mecanismo de captura de señales (`signal`) que asegure que si el proceso recibe una señal `SIGINT` (Ctrl+C) o `SIGTERM`, las descargas pendientes en el pool asíncrono se completen de forma limpia antes de salir (Graceful Shutdown).

---

## 📚 Recursos Recomendados
*   **Libro:** *Python Concurrency with Asyncio* (Matthew Fowler).
*   **Artículo:** "Speed Up Your Python Program With Concurrency" (Real Python).
*   **Charla PyCon:** "Asyncio in Python: Past, Present, and Future" por Lukasz Langa.

---

## ✅ Validación de Conocimientos
* [ ] Explicar por qué `multiprocessing` tiene un costo de inicio superior en sistemas basados en Windows (`spawn`) comparado con Unix (`fork`).
* [ ] Implementar un pipeline de datos productor-consumidor usando `asyncio.Queue` y workers paralelos asíncronos.
* [ ] Explicar qué ocurre si se ejecuta código síncrono intensivo dentro de una función asíncrona sin delegar a un ejecutor (`loop.run_in_executor`).

---

## ⚠️ Advertencias de Seniors
> [!CAUTION]
> **Error de Senior:** Compartir conexiones o sockets TCP no seguros para hilos a través de múltiples procesos hijos sin inicializarlos dentro del contexto local de cada proceso, resultando en cierres inesperados de conexión y corrupción de datos.
