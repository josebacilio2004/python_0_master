# Bloque 1: La Matriz Fundamental (Días 1-15)

## 🧠 Teoría Profunda

### Gestión de Memoria en CPython: Stack vs Heap
En Python, toda variable es únicamente un puntero que hace referencia a un objeto alojado físicamente en el Heap de CPython.
*   **Stack (Pila):** Almacena las variables locales de las funciones y los marcos de ejecución activos. Su crecimiento y liberación es automático y rápido. Solo contiene las direcciones de memoria de los objetos del Heap.
*   **Heap (Montículo):** Región de memoria dinámica donde CPython crea los objetos (`int`, `str`, `list`, etc.). Cada objeto en el heap contiene dos campos estructurales obligatorios (definidos en la estructura interna `PyObject` en C):
    1.  `ob_refcnt`: Contador de referencias que indica cuántos punteros apuntan a él.
    2.  `ob_type`: Puntero a la estructura del tipo de objeto.

#### Algoritmos de Recolección de Basura (Garbage Collection - GC)
*   **Reference Counting:** En cuanto `ob_refcnt` cae a 0, CPython libera inmediatamente la memoria del objeto de forma determinista.
*   **Generational Garbage Collector:** Diseñado para recolectar referencias circulares (por ejemplo, `a.x = b` y `b.x = a`). Utiliza tres generaciones (0, 1 y 2). Los objetos que sobreviven a una recolección son promovidos a la siguiente generación. La recolección de generaciones superiores se realiza con menor frecuencia debido a su costo.

### Sistema de Tipos y Paso de Parámetros
*   **Mutables vs Inmutables:** Los inmutables (`tuple`, `frozenset`, `int`, `str`) garantizan seguridad al no poder alterar su contenido en el heap una vez creados. Los mutables (`list`, `dict`, `set`) permiten modificaciones en su espacio de memoria asignado, lo que puede causar efectos colaterales inesperados si se comparten referencias.
*   **Paso de Objetos por Asignación:** Al invocar una función, Python copia el puntero al objeto en la variable local de la función. No copia el objeto completo (no es paso por valor) ni pasa la celda de la variable que contiene el puntero (no es paso por referencia clásico).

### El Global Interpreter Lock (GIL)
CPython utiliza el GIL para proteger la gestión de memoria interna que no es segura para hilos (*thread-safe*).
*   **Mecanismo:** El GIL es un mutex que garantiza que solo un hilo del sistema operativo ejecute bytecodes de Python al mismo tiempo por proceso.
*   **Limitación:** El paralelismo real en múltiples núcleos de CPU no es posible usando hilos nativos de Python. Para tareas intensivas en CPU (CPU-bound), se requiere multiprocesamiento (`multiprocessing`).

---

## 🛠️ Contraste de Código

### ❌ Código Ineficiente (Inserción al inicio de listas y búsquedas ineficientes)
```python
# Buscar si elementos están en una lista y modificar el inicio de la lista
elementos = [i for i in range(100000)]
objetivos = [99999, -1, 50000]

# Problema 1: Inserción al principio de una lista es O(N)
def agregar_inicio(lista, item):
    lista.insert(0, item)  # Desplaza todos los elementos en memoria
    return lista

# Problema 2: El operador 'in' sobre listas es O(N) lineal
encontrados = []
for obj in objetivos:
    if obj in elementos:  # Escaneo lineal completo
        encontrados.append(obj)
```

### Enfoque Optimizado (Uso de Deque y Sets)
```python
from collections import deque
from typing import List, Set

# Solución 1: Usar collections.deque para inserciones en extremos O(1)
def agregar_inicio_optimo(lista_doble: deque, item: int) -> deque:
    lista_doble.appendleft(item)  # Operación O(1) constante
    return lista_doble

# Solución 2: Usar sets (tablas hash) para búsquedas O(1) promedio
elementos_set: Set[int] = set(range(100000))
objetivos: List[int] = [99999, -1, 50000]

encontrados = [obj for obj in objetivos if obj in elementos_set]  # O(1) por cada búsqueda
```

---

## 📋 Práctica Obligatoria y Ejercicios
1.  **Complejidad Temporal (Big O):** Analiza el comportamiento temporal de `list`, `dict` y `set`. Documenta cuándo usar cada estructura.
2.  **Proyecto Mini: Sistema de Inventario**
    *   Crea una consola interactiva para registrar productos (ID, nombre, stock, precio).
    *   Utiliza *dict comprehensions* para generar listas de alertas de bajo stock.
    *   Captura excepciones explícitas (`KeyError`, `ValueError`) en la lectura de entradas de usuario.

---

## 📦 Entregable del Bloque
Escribe las funciones lógicas básicas en un archivo y documéntalas con doctests interactivos.

```python
from typing import List, Optional

def fizz_buzz(n: int) -> List[str]:
    """
    >>> fizz_buzz(5)
    ['1', '2', 'Fizz', '4', 'Buzz']
    """
    res = []
    for i in range(1, n + 1):
        if i % 15 == 0: res.append("FizzBuzz")
        elif i % 3 == 0: res.append("Fizz")
        elif i % 5 == 0: res.append("Buzz")
        else: res.append(str(i))
    return res

def es_palindromo(cadena: str) -> bool:
    """
    >>> es_palindromo("radar")
    True
    >>> es_palindromo("python")
    False
    """
    limpia = "".join(c.lower() for c in cadena if c.isalnum())
    return limpia == limpia[::-1]
```

Para validar los doctests, ejecuta: `python -m doctest -v tu_archivo.py`.

---

## 📚 Recursos Recomendados
*   **Libro:** *Fluent Python* (Luciano Ramalho) - Capítulos 1 (The Python Data Model) y 2 (An Array of Sequences).
*   **Libro:** *CPython Internals* (Anthony Shaw) - Capítulos sobre gestión de objetos y el bucle de ejecución.
*   **Charla PyCon:** "Understanding the Python GIL" por David Beazley.

---

## ✅ Validación de Conocimientos
* [ ] Explicar la diferencia de comportamiento entre `is` (identidad de memoria `id()`) y `==` (comparación de valor `__eq__`).
* [ ] Argumentar por qué una lista de tuplas es más ligera en memoria que una lista de listas.
* [ ] Resolver un bug de referencias circulares usando la biblioteca estándar `weakref`.

---

## ⚠️ Advertencias de Seniors
> [!WARNING]
> **Error de Senior:** Reutilizar variables mutables en las firmas de funciones como argumentos por defecto. Genera un estado compartido no deseado persistente entre ejecuciones concurrentes de la función. Use siempre `default=None` como valor centinela.
