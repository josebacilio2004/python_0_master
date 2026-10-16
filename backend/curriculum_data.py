# curriculum_data.py - Base de Conocimiento con Atajos, Explicaciones de Código y Teoría Ampliada

CURRICULUM = [
    {
        "id": "bloque_1",
        "title": "Bloque 1: La Matriz Fundamental",
        "days": "Días 1-15",
        "icon": "🧠",
        "description": "De la sintaxis inicial y variables al funcionamiento interno de memoria en CPython, Stack vs Heap y el GIL.",
        "lessons": [
            {
                "id": "b1_l1",
                "title": "1.1 Sintaxis Básica, Variables y Tipos Primitivos",
                "theory": """### Sintaxis y Gestión de Memoria en Python
Python es un lenguaje interpretado, dinámico pero **fuertemente tipado**. Las variables no son contenedores de datos fijos, sino **punteros** que apuntan a objetos en la memoria Heap.

* **Tipos Primitivos Inmutables:**
  * `int`: Enteros de precisión arbitraria (`10`, `-5`).
  * `float`: Números de coma flotante (`3.14159`).
  * `str`: Cadenas de caracteres inmutables (`"Hola Python"`).
  * `bool`: Valores booleanos (`True`, `False`).
  * `NoneType`: Representa la ausencia de valor (`None`).

### Casting e Inmutabilidad
Cuando modificas una variable entera o de texto, Python **no altera** el objeto en memoria, sino que crea un **nuevo objeto** en el Heap y mueve la referencia del puntero.""",
                "code_bad": """# Antipatrón: Concatenación repetida de cadenas en bucle
def unir_cadenas_lento(lista_palabras):
    resultado = ""
    for palabra in lista_palabras:
        resultado += palabra + " " # Ineficiente: Crea un nuevo string por cada iteración
    return resultado""",
                "code_good": """# Enfoque Optimizado (Pythonic Way)
def unir_cadenas_rapido(lista_palabras: list) -> str:
    # join() asigna memoria una sola vez en CPython O(N)
    return " ".join(lista_palabras)""",
                "quiz": {
                    "question": "¿Qué ocurre internamente en memoria cuando ejecutas `nombre = 'Ana'` y luego `nombre = 'Carlos'`?",
                    "options": [
                        "Se modifica el contenido del string 'Ana' en el heap.",
                        "Se crea un nuevo objeto 'Carlos' en el Heap y la variable 'nombre' apunta a él. 'Ana' será liberado si su contador de referencias llega a 0.",
                        "Python convierte la variable a tipo mutable.",
                        "Se produce un error de tipado estático."
                    ],
                    "answer": 1,
                    "explanation": "Los objetos `str` son inmutables. Asignar un nuevo texto no modifica el string original, sino que hace que la variable apunte a una nueva instancia en el Heap."
                },
                "exercise": {
                    "instructions": "Escribe una función `convertir_temperatura(celsius: float) -> dict` que retorne un diccionario con las llaves `'fahrenheit'` y `'kelvin'`. Fórmula F = (C * 9/5) + 32, K = C + 273.15.",
                    "hints": """💡 **Atajos & Pistas de Resolución:**
* **Atajo 1 (Operaciones Aritméticas):** Recuerda usar `/` para división flotante exacta `(celsius * 9/5) + 32`.
* **Atajo 2 (Construcción de Diccionarios):** Puedes construir y retornar el diccionario directamente en una sola línea `return {'fahrenheit': ..., 'kelvin': ...}`.
* **Caso Borde:** La temperatura en Kelvin no puede ser negativa en la física real, pero matemáticamente sumamos `273.15` a la entrada.""",
                    "solution_explanation": """🔍 **Explicación Paso a Paso del Código:**
1. `def convertir_temperatura(celsius: float) -> dict:` -> Definimos la función indicando anotaciones de tipo (`float` entrada, `dict` retorno).
2. `f = (celsius * 9 / 5) + 32` -> Calculamos la conversión a Fahrenheit aplicando la precedencia de operadores.
3. `k = celsius + 273.15` -> Calculamos Kelvin sumando la constante estándar.
4. `return {"fahrenheit": f, "kelvin": k}` -> Construimos y retornamos un objeto diccionario nativo en O(1).""",
                    "starter_code": """def convertir_temperatura(celsius: float) -> dict:
    # Tu código aquí
    pass
""",
                    "test_code": """
res = convertir_temperatura(0.0)
assert res['fahrenheit'] == 32.0, f"Esperado 32.0, obtenido {res.get('fahrenheit')}"
assert res['kelvin'] == 273.15, f"Esperado 273.15, obtenido {res.get('kelvin')}"
print("¡Conversión de temperatura correcta!")
"""
                }
            },
            {
                "id": "b1_l2",
                "title": "1.2 Control de Flujo, Condicionales e Iteraciones",
                "theory": """### Estructuras de Control de Flujo
* **Condicionales:** `if`, `elif`, `else`. Evaluaciones booleanas de valores (*truthy* / *falsy*).
* **Bucles:** `for` (iteración sobre secuencias e iterables) y `while` (bucle basado en condición).

### Funciones Nativas de Iteración
* `enumerate(iterable)`: Devuelve pares `(índice, elemento)`.
* `zip(iter1, iter2)`: Combina múltiples iterables en tuplas de forma paralela.
* `range(start, stop, step)`: Genera secuencias numéricas sin cargarlas completamente en memoria.""",
                "code_bad": """# Antipatrón: Iterar usando rangos de índices manualmente
frutas = ["Manzana", "Banana", "Cereza"]
for i in range(len(frutas)):
    print(i, frutas[i])""",
                "code_good": """# Enfoque Optimizado: Uso de enumerate()
frutas = ["Manzana", "Banana", "Cereza"]
for indice, fruta in enumerate(frutas):
    print(f"{indice}: {fruta}")""",
                "quiz": {
                    "question": "¿Cuál es la función nativa recomendada para iterar simultáneamente sobre un elemento y su índice en Python?",
                    "options": [
                        "range(len(lista))",
                        "enumerate(lista)",
                        "zip(lista)",
                        "list.index()"
                    ],
                    "answer": 1,
                    "explanation": "`enumerate()` es la forma idiomática y eficiente en Python para obtener tanto el índice como el valor en cada paso de un bucle."
                },
                "exercise": {
                    "instructions": "Escribe una función `es_primo(numero: int) -> bool` que retorne `True` si el número es primo y `False` si no lo es.",
                    "hints": """💡 **Atajos & Pistas de Resolución:**
* **Atajo 1 (Casos Especiales):** Los números menores o iguales a 1 (`<= 1`) NO son primos. Retorna `False` de inmediato.
* **Atajo 2 (Optimización Matemática):** No necesitas probar divisores hasta `numero`. Basta con probar divisores desde `2` hasta la raíz cuadrada `int(numero**0.5) + 1`.
* **Atajo 3 (Operador Módulo `%`):** `numero % i == 0` indica que `i` es un divisor exacto.""",
                    "solution_explanation": """🔍 **Explicación Paso a Paso del Código:**
1. `if numero <= 1: return False` -> Descartamos 0, 1 y negativos ya que por definición los primos son mayores a 1.
2. `for i in range(2, int(numero**0.5) + 1):` -> Iteramos solo hasta la raíz cuadrada optimizando el algoritmo de O(N) a O(sqrt(N)).
3. `if numero % i == 0: return False` -> Si encontramos algún divisor que deje residuo cero, confirmamos que es compuesto y cortamos la ejecución.
4. `return True` -> Si ningún número dividió exactamente, confirmamos que es primo.""",
                    "starter_code": """def es_primo(numero: int) -> bool:
    # Tu código aquí
    pass
""",
                    "test_code": """
assert es_primo(7) == True, "7 debería ser primo"
assert es_primo(10) == False, "10 no debería ser primo"
assert es_primo(1) == False, "1 no es primo"
print("¡Detector de números primos verificado!")
"""
                }
            },
            {
                "id": "b1_l3",
                "title": "1.3 Colecciones Nativas & Comprehensions",
                "theory": """### Colecciones Principales en Python
1. **Listas (`list`):** Secuencia ordenada y mutable `[1, 2, 3]`.
2. **Tuplas (`tuple`):** Secuencia ordenada e inmutable `(1, 2, 3)`. Menor peso en memoria.
3. **Conjuntos (`set`):** Colección desordenada de elementos únicos `{1, 2, 3}`. Búsquedas O(1).
4. **Diccionarios (`dict`):** Pares clave-valor `{"id": 1}`. Búsquedas O(1) basadas en hash.

### Comprehensions
Permiten construir colecciones de forma concisa y rápida directamente en CPython.
* Dict Comprehension: `{k: v for k, v in iterable if condicion}`""",
                "code_bad": """# Antipatrón: Construir un diccionario filtrado mediante bucles tradicionales
precios = {"laptop": 1200, "mouse": 25, "teclado": 80, "monitor": 300}
caros = {}
for prod, precio in precios.items():
    if precio > 100:
        caros[prod] = precio""",
                "code_good": """# Enfoque Optimizado: Dict Comprehension
precios = {"laptop": 1200, "mouse": 25, "teclado": 80, "monitor": 300}
caros = {prod: precio for prod, precio in precios.items() if precio > 100}""",
                "quiz": {
                    "question": "¿Qué estructura de datos deberías usar para eliminar duplicados de una lista en tiempo O(N)?",
                    "options": [
                        "list()",
                        "set()",
                        "tuple()",
                        "dict.fromkeys()"
                    ],
                    "answer": 1,
                    "explanation": "Convertir una lista a `set()` elimina automáticamente todos los duplicados gracias a la unicidad de las claves en la tabla Hash."
                },
                "exercise": {
                    "instructions": "Escribe una función `filtrar_pares_cuadrados(numeros: list) -> list` usando List Comprehension que reciba una lista de enteros y retorne el cuadrado solo de los números pares.",
                    "hints": """💡 **Atajos & Pistas de Resolución:**
* **Atajo 1 (List Comprehension):** La sintaxis es `[expresion for elemento in iterable if condicion]`.
* **Atajo 2 (Operador Par `% 2`):** Un número `n` es par si `n % 2 == 0`.
* **Atajo 3 (Exponente `**`):** El cuadrado de `x` se escribe `x ** 2` o `x * x`.""",
                    "solution_explanation": """🔍 **Explicación Paso a Paso del Código:**
1. `return [x**2 for x in numeros if x % 2 == 0]` -> Creamos una lista filtrada en un único paso.
2. `for x in numeros` -> Recorre secuencialmente cada número del argumento.
3. `if x % 2 == 0` -> Filtra únicamente los enteros pares.
4. `x**2` -> Eleva cada entero filtrado al cuadrado y lo inserta en la nueva lista devuelta en memoria.""",
                    "starter_code": """def filtrar_pares_cuadrados(numeros: list) -> list:
    # Tu solución con list comprehension
    pass
""",
                    "test_code": """
res = filtrar_pares_cuadrados([1, 2, 3, 4, 5, 6])
assert res == [4, 16, 36], f"Esperado [4, 16, 36], obtenido {res}"
print("¡List comprehension validado!")
"""
                }
            },
            {
                "id": "b1_l4",
                "title": "1.4 Memoria en CPython (Stack vs Heap) y el GIL",
                "theory": """### Gestión de Memoria en CPython
* **Stack (Pila):** Guarda los marcos de ejecución de funciones y las variables locales (punteros a objetos).
* **Heap (Montículo):** Región de memoria dinámica donde CPython crea los objetos. Cada objeto contiene un contador de referencias (`ob_refcnt`).
* **Garbage Collector:** Cuando `ob_refcnt` cae a 0, la memoria del objeto se libera de inmediato. Para ciclos de referencias circulares, Python usa un recolección generacional (generaciones 0, 1 y 2).

### El Global Interpreter Lock (GIL)
Es un mutex que garantiza que solo un hilo nativo ejecute bytecode de Python a la vez en CPython, protegiendo la gestión de memoria interna.""",
                "code_bad": """# Antipatrón: Argumento mutable por defecto en función
def registrar_evento(evento: str, log: list = []):
    log.append(evento)
    return log""",
                "code_good": """# Enfoque Optimizado: Uso de None como valor centinela
def registrar_evento_optimo(evento: str, log: list = None) -> list:
    if log is None:
        log = [] # Instancia limpia en el Heap por llamada
    log.append(evento)
    return log""",
                "quiz": {
                    "question": "¿Qué herramienta interna de CPython resuelve las referencias circulares de memoria que el conteo de referencias no puede liberar?",
                    "options": [
                        "El GIL",
                        "El Recolector de Basura Generacional (Generational GC)",
                        "El módulo threading",
                        "El compilador JIT"
                    ],
                    "answer": 1,
                    "explanation": "El Recolector de Basura Generacional rastrea contenedores mutables en 3 generaciones para romper ciclos donde dos objetos se apuntan mutuamente."
                },
                "exercise": {
                    "instructions": "Escribe la función `fizz_buzz(n: int) -> list` que retorne una lista de strings de 1 a n donde los múltiplos de 3 sean 'Fizz', los de 5 'Buzz', los de 15 'FizzBuzz' y los demás números como texto.",
                    "hints": """💡 **Atajos & Pistas de Resolución:**
* **Atajo 1 (Múltiplo de 15):** Evalúa PRIMERO la condición `i % 15 == 0` (o `i % 3 == 0 and i % 5 == 0`) antes de evaluar 3 o 5 por separado.
* **Atajo 2 (Casting `str()`):** Convierte los enteros a cadena con `str(i)` cuando no sean múltiplos de 3 o 5.
* **Atajo 3 (Bucle `range`):** Usa `range(1, n + 1)` para incluir el número `n`.""",
                    "solution_explanation": """🔍 **Explicación Paso a Paso del Código:**
1. `res = []` -> Inicializamos la lista de resultados.
2. `for i in range(1, n + 1):` -> Generamos la secuencia del 1 al `n` inclusive.
3. `if i % 15 == 0: res.append("FizzBuzz")` -> Evaluamos la divisibilidad simultánea entre 3 y 5.
4. `elif i % 3 == 0: res.append("Fizz")` / `elif i % 5 == 0: res.append("Buzz")` -> Evaluamos divisibilidad individual.
5. `else: res.append(str(i))` -> Si no cumple ninguna condición anterior, convertimos el número a string.""",
                    "starter_code": """def fizz_buzz(n: int) -> list:
    # Tu código aquí
    pass
""",
                    "test_code": """
res = fizz_buzz(5)
assert res == ['1', '2', 'Fizz', '4', 'Buzz'], f"Obtenido {res}"
assert fizz_buzz(15)[14] == 'FizzBuzz'
print("¡FizzBuzz verificado!")
"""
                }
            }
        ]
    },
    {
        "id": "bloque_2",
        "title": "Bloque 2: OOP Avanzada y Paradigma Funcional",
        "days": "Días 16-30",
        "icon": "⚙️",
        "description": "Fundamentos de POO, Modelo de Datos de Python (`dunder methods`), `__slots__`, descriptores y herramientas funcionales.",
        "lessons": [
            {
                "id": "b2_l1",
                "title": "2.1 Fundamentos de POO (Clases, Encapsulamiento y Herencia)",
                "theory": """### Programación Orientada a Objetos en Python
* **Clases y Objetos:** Una clase es la plantilla que define atributos y métodos. Un objeto es la instancia viva en el Heap.
* **Encapsulamiento:** Convenio de nombres en Python:
  * `_atributo`: Atributo protegido (por convención, uso interno).
  * `__atributo`: Atributo privado (Python aplica *Name Mangling* `_Clase__atributo`).
* **Herencia y `super()`:** Permite a una subclase reutilizar y extender el comportamiento de una clase padre.""",
                "code_bad": """# Antipatrón: Acceso directo inseguro a atributos sensibles
class CuentaBancariaInsegura:
    def __init__(self, saldo):
        self.saldo = saldo""",
                "code_good": """# Enfoque Optimizado: Encapsulamiento con getters/setters y propiedades
class CuentaBancaria:
    def __init__(self, saldo_inicial: float):
        self._saldo = max(0.0, saldo_inicial)

    @property
    def saldo(self) -> float:
        return self._saldo

    def depositar(self, monto: float):
        if monto > 0:
            self._saldo += monto""",
                "quiz": {
                    "question": "¿Qué mecanismo aplica Python internamente a las variables que comienzan con doble guion bajo como `__saldo`?",
                    "options": [
                        "Las encripta en el disco duro.",
                        "Name Mangling: les cambia el nombre interno a `_NombreClase__saldo` para evitar colisiones en herencia.",
                        "Las hace constantes inmutables.",
                        "Las elimina del Heap."
                    ],
                    "answer": 1,
                    "explanation": "Python transforma el nombre de variables con `__` agregando el prefijo de la clase para prevenir sobrescrituras accidentales en subclases."
                },
                "exercise": {
                    "instructions": "Crea la clase `CuentaBancaria` con método `depositar(monto)` y propiedad `@property def saldo()`. El saldo inicial debe ser recibido en `__init__`.",
                    "hints": """💡 **Atajos & Pistas de Resolución:**
* **Atajo 1 (Atributo Privado):** Almacena el saldo en un atributo protegido `self._saldo`.
* **Atajo 2 (Decorador `@property`):** Define `saldo` como propiedad `@property def saldo(self): return self._saldo`.
* **Atajo 3 (Método `depositar`):** Suma el monto recibido a `self._saldo` solo si `monto > 0`.""",
                    "solution_explanation": """🔍 **Explicación Paso a Paso del Código:**
1. `def __init__(self, saldo_inicial: float): self._saldo = saldo_inicial` -> Inicializamos la instancia protegiendo el saldo en `_saldo`.
2. `@property def saldo(self): return self._saldo` -> Permitimos consultar el saldo como atributo `c.saldo` de solo lectura limpia.
3. `def depositar(self, monto: float): self._saldo += monto` -> Modificamos el estado interno aumentando el saldo disponible.""",
                    "starter_code": """class CuentaBancaria:
    def __init__(self, saldo_inicial: float):
        # Tu código aquí
        pass
""",
                    "test_code": """
c = CuentaBancaria(100.0)
c.depositar(50.0)
assert c.saldo == 150.0, f"Esperado 150.0, obtenido {c.saldo}"
print("¡Clase CuentaBancaria validada!")
"""
                }
            },
            {
                "id": "b2_l2",
                "title": "2.2 El Modelo de Datos (`dunder methods`) y __slots__",
                "theory": """### El Modelo de Datos de Python
Permite personalizar el comportamiento de tus clases ante operadores nativos (`+`, `len()`, `str()`, `[]`).

* `__str__`: Representación legible para usuarios.
* `__repr__`: Representación inequívoca para desarrolladores.
* `__len__`: Retorna la longitud del objeto.
* `__getitem__`: Permite indexar con corchetes `objeto[idx]`.

### Optimización de Memoria con `__slots__`
Por defecto cada instancia tiene un `__dict__` dinámico. Definir `__slots__ = ('x', 'y')` elimina el `__dict__` reduciendo el peso en memoria hasta un 70%.""",
                "code_bad": """# Clase tradicional con __dict__ (Consumo alto de memoria)
class PuntoNormal:
    def __init__(self, x, y):
        self.x = x
        self.y = y""",
                "code_good": """# Clase optimizada con __slots__ y sobrecarga de operador suma
class Vector2D:
    __slots__ = ('x', 'y')
    def __init__(self, x: float, y: float):
        self.x = x
        self.y = y

    def __add__(self, otro: 'Vector2D') -> 'Vector2D':
        return Vector2D(self.x + otro.x, self.y + otro.y)""",
                "quiz": {
                    "question": "¿Qué método mágico debes implementar para permitir que tu clase responda al operador de suma `+`?",
                    "options": ["__sum__", "__add__", "__plus__", "__concat__"],
                    "answer": 1,
                    "explanation": "El método `__add__(self, other)` es invocado internamente por CPython cuando se utiliza el operador `+` entre dos objetos."
                },
                "exercise": {
                    "instructions": "Crea una clase `Vector2D` con `__slots__ = ('x', 'y')` e implementa `__add__` para sumar dos vectores.",
                    "hints": """💡 **Atajos & Pistas de Resolución:**
* **Atajo 1 (`__slots__`):** Define `__slots__ = ('x', 'y')` justo al inicio de la clase.
* **Atajo 2 (`__add__`):** El método mágico `__add__(self, otro)` debe retornar una NUEVA instancia de `Vector2D(self.x + otro.x, self.y + otro.y)`.
* **Atajo 3 (Constructores):** Accede a las coordenadas directamente con `self.x` y `otro.x`.""",
                    "solution_explanation": """🔍 **Explicación Paso a Paso del Código:**
1. `__slots__ = ('x', 'y')` -> Elimina el `__dict__` optimizando memoria en el Heap CPython.
2. `def __init__(self, x: float, y: float): self.x = x; self.y = y` -> Asigna las coordenadas iniciales.
3. `def __add__(self, otro): return Vector2D(self.x + otro.x, self.y + otro.y)` -> Sobrecarga el operador `+` creando una nueva instancia resultado.""",
                    "starter_code": """class Vector2D:
    __slots__ = ('x', 'y')
    def __init__(self, x: float, y: float):
        self.x = x
        self.y = y
    # Implementa __add__
""",
                    "test_code": """
v1 = Vector2D(1.0, 2.0)
v2 = Vector2D(3.0, 4.0)
v3 = v1 + v2
assert v3.x == 4.0 and v3.y == 6.0, f"Esperado (4.0, 6.0), obtenido ({v3.x}, {v3.y})"
print("¡Sobrecarga de operador suma en Vector2D validada!")
"""
                }
            },
            {
                "id": "b2_l3",
                "title": "2.3 Descriptores, Protocolos y Context Managers",
                "theory": """### Protocolos Nativos
* **Context Manager (`with`):** Requiere `__enter__()` (inicialización) y `__exit__()` (limpieza automática de recursos).

### Protocolo Descriptor
Un descriptor es una clase que controla el acceso a un atributo en otra clase implementando `__get__()`, `__set__()` o `__delete__()`. Es la base de `@property`, `@classmethod` y los ORMs.""",
                "code_bad": """# Gestión manual insegura de archivos sin context manager
f = open("datos.txt", "w")
f.write("hola")""",
                "code_good": """# Enfoque Optimizado: Context Manager nativo con 'with'
with open("datos.txt", "w") as f:
    f.write("hola")""",
                "quiz": {
                    "question": "¿Qué método de un Context Manager se ejecuta automáticamente al salir de un bloque `with`, garantizando la liberación de recursos?",
                    "options": ["__close__", "__exit__", "__stop__", "__finally__"],
                    "answer": 1,
                    "explanation": "El método `__exit__(self, exc_type, exc_val, exc_tb)` se invoca siempre al finalizar el bloque `with`, gestionando excepciones si las hubiera."
                },
                "exercise": {
                    "instructions": "Crea una clase `Temporizador` que funcione como Context Manager (`__enter__` y `__exit__`) guardando el tiempo transcurrido en el atributo `tiempo_total`.",
                    "hints": """💡 **Atajos & Pistas de Resolución:**
* **Atajo 1 (`__enter__`):** Guarda `self.inicio = time.time()` y retorna `self`.
* **Atajo 2 (`__exit__`):** Calcula `self.tiempo_total = time.time() - self.inicio`.
* **Atajo 3 (`time.time()`):** Importa el módulo `time` para medir las marcas de tiempo en segundos.""",
                    "solution_explanation": """🔍 **Explicación Paso a Paso del Código:**
1. `def __enter__(self): self.inicio = time.time(); return self` -> Guarda la marca de tiempo de inicio al entrar al bloque `with` y se retorna a sí misma.
2. `def __exit__(self, exc_type, exc_val, exc_tb): self.tiempo_total = time.time() - self.inicio` -> Calcula la diferencia temporal al salir del bloque garantizando la medición.""",
                    "starter_code": """import time

class Temporizador:
    def __enter__(self):
        self.inicio = time.time()
        return self
    def __exit__(self, exc_type, exc_val, exc_tb):
        self.tiempo_total = time.time() - self.inicio
""",
                    "test_code": """
with Temporizador() as t:
    time.sleep(0.1)
assert t.tiempo_total >= 0.09, "El temporizador debe registrar el tiempo"
print("¡Context Manager Temporizador verificado!")
"""
                }
            }
        ]
    },
    {
        "id": "bloque_3",
        "title": "Bloque 3: Concurrencia y Paralelismo Real",
        "days": "Días 31-45",
        "icon": "⚡",
        "description": "Threading, Multiprocessing y Asyncio. Diferencias físicas, uso de memoria y resolución de cuellos de botella.",
        "lessons": [
            {
                "id": "b3_l1",
                "title": "3.1 Threading y Sincronización (I/O-Bound)",
                "theory": """### Hilos en CPython (`threading`)
Los hilos en Python son hilos del sistema operativo. Debido al **GIL**, no pueden ejecutar bytecode de Python en paralelo en múltiples núcleos.

* **Caso de uso óptimo:** Operaciones de entrada/salida (I/O-bound) como descargar páginas web, consultar bases de datos o leer archivos de disco. Durante el I/O, CPython **libera el GIL**.
* **Sincronización:** Uso de `threading.Lock()` para prevenir condiciones de carrera al modificar datos compartidos.""",
                "code_bad": """# Antipatrón: Condición de carrera al modificar estado global desde múltiples hilos
import threading

contador = 0
def incrementar_inseguro():
    global contador
    for _ in range(100000):
        contador += 1""",
                "code_good": """# Enfoque Optimizado: Protección con Lock
import threading

contador = 0
lock = threading.Lock()

def incrementar_seguro():
    global contador
    for _ in range(100000):
        with lock:
            contador += 1""",
                "quiz": {
                    "question": "¿Por qué el uso de hilos (`threading`) en Python SI mejora el rendimiento en peticiones de red pero NO en cálculos matemáticos?",
                    "options": [
                        "Porque el GIL se libera automáticamente durante bloqueos de E/S de red.",
                        "Porque la red no utiliza memoria RAM.",
                        "Porque los hilos convierten el código a C automáticamente.",
                        "Porque los cálculos matemáticos bloquean la tarjeta de red."
                    ],
                    "answer": 0,
                    "explanation": "CPython libera el GIL mientras espera respuestas de red o disco, permitiendo que otros hilos se ejecuten en ese intervalo."
                },
                "exercise": {
                    "instructions": "Escribe una función `ejecutar_hilos_paralelos(func, veces: int)` que lance la función recibida en `veces` hilos simultáneos usando `threading.Thread` y los espere con `.join()`.",
                    "hints": """💡 **Atajos & Pistas de Resolución:**
* **Atajo 1 (Creación de Hilos):** `t = threading.Thread(target=func)`.
* **Atajo 2 (Inicio y Sincronización):** Llama a `t.start()` para iniciar y a `t.join()` en una lista de hilos para bloquear hasta que todos terminen.
* **Atajo 3 (Lista de Hilos):** Guarda cada hilo en una lista `hilos = []` para iterar y hacer `.join()`.""",
                    "solution_explanation": """🔍 **Explicación Paso a Paso del Código:**
1. `hilos = [threading.Thread(target=func) for _ in range(veces)]` -> Instanciamos los hilos requeridos indicando la función objetivo.
2. `for t in hilos: t.start()` -> Iniciamos la ejecución concurrente de cada hilo en el sistema operativo.
3. `for t in hilos: t.join()` -> Sincronizamos la salida garantizando que la función padre espere el término de todos los hilos.""",
                    "starter_code": """import threading

def ejecutar_hilos_paralelos(func, veces: int):
    # Tu código de hilos aquí
    pass
""",
                    "test_code": """
resultado = []
def tarea():
    resultado.append(1)

ejecutar_hilos_paralelos(tarea, 5)
assert len(resultado) == 5, f"Esperado 5 elementos, obtenido {len(resultado)}"
print("¡Ejecución de hilos en paralelo verificada!")
"""
                }
            },
            {
                "id": "b3_l2",
                "title": "3.2 Multiprocessing (CPU-Bound)",
                "theory": """### Paralelismo con `multiprocessing`
Para tareas intensivas en CPU (procesamiento de imágenes, matemáticas pesadas), se deben crear **procesos independientes**. Cada proceso tiene su propio intérprete de CPython y su propio GIL.

* `ProcessPoolExecutor`: Administra un pool de procesos paralelos.
* IPC (Comunicación interprocesos): Los procesos no comparten memoria. Se comunican mediante `Queue` o `Pipe` serializando objetos con `pickle`.""",
                "code_bad": """# Ineficiente: Procesar grandes cálculos numéricos en un solo hilo
def calcular_cuadrados_lento(numeros):
    return [x**2 for x in numeros]""",
                "code_good": """# Optimizado: Distribución de carga en múltiples núcleos
from concurrent.futures import ProcessPoolExecutor

def cuadrado(x):
    return x**2

def calcular_cuadrados_paralelo(numeros):
    with ProcessPoolExecutor() as executor:
        return list(executor.map(cuadrado, numeros))""",
                "quiz": {
                    "question": "¿Cómo logra el módulo `multiprocessing` evitar las limitaciones del GIL?",
                    "options": [
                        "Desactivando el GIL en todo el sistema operativo.",
                        "Creando múltiples procesos con intérpretes de CPython independientes y espacios de memoria separados.",
                        "Usando solo memoria Stack.",
                        "Compilando a lenguaje ensamblador."
                    ],
                    "answer": 1,
                    "explanation": "Cada proceso lanzado tiene su propio espacio de memoria y su propio GIL, logrando verdadero paralelismo en múltiples núcleos de CPU."
                },
                "exercise": {
                    "instructions": "Define la función `cuadrado_numero(n: int) -> int` que retorne `n * n` para ser utilizada en tareas de multiprocesamiento.",
                    "hints": """💡 **Atajos & Pistas de Resolución:**
* **Atajo 1:** Es una función simple de nivel superior que retorna `n * n` o `n ** 2`.
* **Atajo 2 (Serialización Pickle):** Las funciones pasadas a `multiprocessing` deben estar definidas en el módulo superior para ser serializables por `pickle`.""",
                    "solution_explanation": """🔍 **Explicación Paso a Paso del Código:**
1. `def cuadrado_numero(n: int) -> int:` -> Definición simple de la función pura.
2. `return n * n` -> Devuelve la multiplicación escalar sin efectos colaterales de memoria compartida.""",
                    "starter_code": """def cuadrado_numero(n: int) -> int:
    return n * n
""",
                    "test_code": """
assert cuadrado_numero(4) == 16
assert cuadrado_numero(9) == 81
print("¡Función de proceso probada!")
"""
                }
            },
            {
                "id": "b3_l3",
                "title": "3.3 Concurrencia Asíncrona Cooperativa con Asyncio",
                "theory": """### Asyncio y el Bucle de Eventos (Event Loop)
Asyncio permite concurrencia masiva en un solo hilo mediante programación asíncrona cooperativa.

* **Corrutina (`async def`):** Función especial que se puede pausar y reanudar.
* **`await`:** Pausa la corrutina actual y devuelve el control al Event Loop para que ejecute otras tareas mientras espera E/S.
* `asyncio.gather(*tasks)`: Ejecuta múltiples corrutinas simultáneamente.""",
                "code_bad": """# Petición bloqueante tradicional dentro de código asíncrono
import time

async def tarea_bad():
    time.sleep(1) # ¡CRÍTICO! Bloquea todo el Event Loop""",
                "code_good": """# Enfoque Optimizado: Pausa cooperativa no bloqueante
import asyncio

async def tarea_good():
    await asyncio.sleep(1) # Cede el control al Event Loop""",
                "quiz": {
                    "question": "¿Qué ocurre si ejecutas una función bloqueante como `time.sleep(5)` dentro de una corrutina asíncrona en Asyncio?",
                    "options": [
                        "Asyncio la convierte automáticamente en asíncrona.",
                        "Bloquea por completo el Event Loop, congelando todas las demás corrutinas concurrentes.",
                        "Lanza una excepción SyntaxError.",
                        "Crea un hilo nuevo automáticamente."
                    ],
                    "answer": 1,
                    "explanation": "Dado que Asyncio ejecuta en un solo hilo, cualquier llamada bloqueante síncrona detiene el Event Loop y congela a todas las tareas."
                },
                "exercise": {
                    "instructions": "Crea una función `async def sumar_async(a: int, b: int) -> int` que haga `await asyncio.sleep(0.05)` y devuelva `a + b`.",
                    "hints": """💡 **Atajos & Pistas de Resolución:**
* **Atajo 1 (Sintaxis Asíncrona):** Usa la palabra clave `async def` para declarar la corrutina.
* **Atajo 2 (`await`):** Antepon la palabra `await` a `asyncio.sleep(0.05)`.
* **Atajo 3 (Retorno):** Retorna la suma `a + b` al finalizar el await.""",
                    "solution_explanation": """🔍 **Explicación Paso a Paso del Código:**
1. `async def sumar_async(a: int, b: int) -> int:` -> Declaramos la corrutina asíncrona.
2. `await asyncio.sleep(0.05)` -> Pausamos la corrutina cediendo voluntariamente el control al Event Loop por 50 milisegundos.
3. `return a + b` -> Retornamos el resultado de la suma una vez que el Event Loop reanuda la ejecución.""",
                    "starter_code": """import asyncio

async def sumar_async(a: int, b: int) -> int:
    # Tu corrutina aquí
    pass
""",
                    "test_code": """
import asyncio
res = asyncio.run(sumar_async(5, 15))
assert res == 20, f"Esperado 20, obtenido {res}"
print("¡Corrutina asíncrona verificada!")
"""
                }
            }
        ]
    },
    {
        "id": "bloque_4",
        "title": "Bloque 4: Arquitectura Avanzada y Tipado",
        "days": "Días 46-60",
        "icon": "📐",
        "description": "Tipado estático con Mypy, Protocolos estructurales, patrones de diseño (Repository, Factory), Pydantic v2 y Pytest.",
        "lessons": [
            {
                "id": "b4_l1",
                "title": "4.1 Tipado Estructural con Protocol y Generics",
                "theory": """### Protocolos y Tipado Estructural
En lugar de heredar de clases base abstractas (`ABC`), `typing.Protocol` permite tipado estructural (Duck Typing verificado estáticamente por Mypy).

### Genéricos (`TypeVar`)
Permiten parametrizar tipos de datos manteniendo la seguridad de tipos estática en clases o repositorios reutilizables.""",
                "code_bad": """# Acoplamiento directo sin contratos de tipo
class ServicioMySQL:
    def guardar(self, datos):
        print("Guardando en MySQL")""",
                "code_good": """# Uso de Protocol para desacoplamiento
from typing import Protocol

class ContratoGuardado(Protocol):
    def guardar(self, datos: dict) -> None:
        ...

class ServicioMySQLOptimizado:
    def guardar(self, datos: dict) -> None:
        print("Guardando en MySQL")""",
                "quiz": {
                    "question": "¿Qué ventaja ofrece `typing.Protocol` respecto a la herencia tradicional con clases base abstractas (`ABC`)?",
                    "options": [
                        "Permite comprobar tipos en tiempo de desarrollo sin obligar a las clases a heredar explícitamente de la interfaz.",
                        "Aumenta la velocidad de ejecución 10 veces.",
                        "Desactiva el recolector de basura.",
                        "Funciona únicamente en archivos `.js`."
                    ],
                    "answer": 0,
                    "explanation": "`Protocol` revisa la estructura de métodos de la clase de forma implícita (*structural subtyping*), flexibilizando la arquitectura."
                },
                "exercise": {
                    "instructions": "Define un modelo Pydantic v2 `Producto` con campos `id: int`, `nombre: str` y `precio: float`.",
                    "hints": """💡 **Atajos & Pistas de Resolución:**
* **Atajo 1 (BaseModel):** La clase debe heredar de `pydantic.BaseModel`.
* **Atajo 2 (Definición de Campos):** Define las variables con sus anotaciones estáticas directamente en el cuerpo de la clase: `id: int`, `nombre: str`, `precio: float`.""",
                    "solution_explanation": """🔍 **Explicación Paso a Paso del Código:**
1. `from pydantic import BaseModel` -> Importamos la clase base de Pydantic v2.
2. `class Producto(BaseModel):` -> Definimos el modelo de transferencia de datos (DTO).
3. `id: int`, `nombre: str`, `precio: float` -> Pydantic compila estas declaraciones en validadores de tiempo de ejecución en Rust.""",
                    "starter_code": """from pydantic import BaseModel

class Producto(BaseModel):
    # Define los tipos aquí
    pass
""",
                    "test_code": """
p = Producto(id=10, nombre="Laptop", precio=999.99)
assert p.id == 10 and p.nombre == "Laptop"
print("¡Modelo Pydantic v2 validado!")
"""
                }
            },
            {
                "id": "b4_l2",
                "title": "4.2 Patrones de Diseño a la Pythónica",
                "theory": """### Patrones de Diseño en Python
* **Repository Pattern:** Desacopla la lógica de negocio pura de los detalles de almacenamiento (SQL, NoSQL, API externa).
* **Factory Pattern:** En Python las clases son objetos de primera clase. Se pueden almacenar en diccionarios para instanciarlas dinámicamente sin jerarquías rígidas de fábricas.
* **Singleton:** Se implementa de forma sencilla usando módulos (los módulos en Python se importan una sola vez en `sys.modules`).""",
                "code_bad": """# Antipatrón: Instanciación rígida mediante sentencias if/else extensas
def crear_notificador_malo(tipo):
    if tipo == "email": return NotificadorEmail()
    elif tipo == "sms": return NotificadorSMS()""",
                "code_good": """# Enfoque Optimizado: Mapeo de fábrica dinámico a la Pythónica
CLASES_NOTIFICADOR = {
    "email": NotificadorEmail,
    "sms": NotificadorSMS
}

def crear_notificador_optimizado(tipo: str):
    cls = CLASES_NOTIFICADOR.get(tipo)
    if not cls: raise ValueError("Desconocido")
    return cls()""",
                "quiz": {
                    "question": "¿Por qué en Python muchas veces el patrón Singleton se resuelve de forma nativa a nivel de módulo?",
                    "options": [
                        "Porque Python prohíbe crear más de una instancia de cualquier clase.",
                        "Porque el sistema de importación de CPython carga y ejecuta los módulos una sola vez y los almacena en `sys.modules`.",
                        "Porque el GIL destruye las instancias duplicadas.",
                        "Porque Pydantic lo exige."
                    ],
                    "answer": 1,
                    "explanation": "Al importar un módulo, Python ejecuta su contenido una sola vez y lo almacena en caché en `sys.modules`, convirtiendo las variables de módulo en Singletons implícitos."
                },
                "exercise": {
                    "instructions": "Crea una función `fabrica_operaciones(tipo: str)` que devuelva la función `sumar` si el tipo es `'suma'` o `restar` si es `'resta'`. Define ambas funciones.",
                    "hints": """💡 **Atajos & Pistas de Resolución:**
* **Atajo 1 (Funciones de Primera Clase):** Retorna el nombre de la función SIN paréntesis (ej. `return sumar`), no el resultado de invocarla.
* **Atajo 2 (Diccionario de Fábrica):** Usa un mapa `ops = {'suma': sumar, 'resta': restar}` y retorna `ops.get(tipo)`.""",
                    "solution_explanation": """🔍 **Explicación Paso a Paso del Código:**
1. `def sumar(a, b): return a + b` / `def restar(a, b): return a - b` -> Definimos funciones puras simples.
2. `ops = {'suma': sumar, 'resta': restar}` -> Creamos la tabla de despacho de funciones.
3. `return ops.get(tipo)` -> Retornamos la referencia directa a la función solicitada.""",
                    "starter_code": """def sumar(a, b): return a + b
def restar(a, b): return a - b

def fabrica_operaciones(tipo: str):
    # Tu lógica aquí
    pass
""",
                    "test_code": """
fn_suma = fabrica_operaciones('suma')
assert fn_suma(10, 5) == 15, "Fábrica debería retornar función sumar"
fn_resta = fabrica_operaciones('resta')
assert fn_resta(10, 5) == 5, "Fábrica debería retornar función restar"
print("¡Fábrica funcional validada!")
"""
                }
            },
            {
                "id": "b4_l3",
                "title": "4.3 Pydantic v2 & Testing Automatizado con Pytest",
                "theory": """### Testing Moderno con Pytest
* **Fixtures:** Permite preparar estados y recursos de prueba reutilizables (`@pytest.fixture`).
* **Parametrización:** `@pytest.mark.parametrize` ejecuta la misma prueba con múltiples conjuntos de datos de entrada.
* **Mocking:** Reemplaza llamados externos o consultas de base de datos pesadas por respuestas simuladas rápidas.""",
                "code_bad": """# Pruebas unitarias lentas que dependen de red o base de datos real
def test_pago():
    respuesta = conectar_api_pasarela_real_stripe() # Lento e inestable
    assert respuesta.status == 200""",
                "code_good": """# Pruebas unitarias aisladas con Mocks
from unittest.mock import MagicMock

def test_pago_mock():
    pasarela_mock = MagicMock()
    pasarela_mock.cobrar.return_value = {"status": "exito"}
    res = pasarela_mock.cobrar(100)
    assert res["status"] == "exito" """,
                "quiz": {
                    "question": "¿Cuál es la función principal de los Mocks en las pruebas unitarias?",
                    "options": [
                        "Aumentar la cobertura de líneas sin ejecutar código.",
                        "Simular componentes externos (APIs, bases de datos) para garantizar que las pruebas sean rápidas, aisladas y deterministas.",
                        "Compilar el código a C++.",
                        "Generar reportes en HTML."
                    ],
                    "answer": 1,
                    "explanation": "Los Mocks aíslan la unidad de código bajo prueba reemplazando dependencias de infraestructura pesadas por respuestas predefinidas en memoria."
                },
                "exercise": {
                    "instructions": "Escribe una función de prueba `validar_email(email: str) -> bool` que retorne `True` si contiene `@` y `.`, y valida con aserciones.",
                    "hints": """💡 **Atajos & Pistas de Resolución:**
* **Atajo 1 (Operador `in`):** Devuelve `True` directamente evaluando `"@" in email and "." in email`.
* **Atajo 2 (Cadenas):** Las búsquedas de subcadenas con `in` se ejecutan en tiempo O(N) muy optimizado en CPython.""",
                    "solution_explanation": """🔍 **Explicación Paso a Paso del Código:**
1. `def validar_email(email: str) -> bool:` -> Recibe la cadena a validar.
2. `return "@" in email and "." in email` -> Realiza ambas comprobaciones booleanas combinadas con el operador lógico `and`.""",
                    "starter_code": """def validar_email(email: str) -> bool:
    return "@" in email and "." in email
""",
                    "test_code": """
assert validar_email("test@example.com") == True
assert validar_email("invalid_email") == False
print("¡Prueba de validación completada!")
"""
                }
            }
        ]
    },
    {
        "id": "bloque_5",
        "title": "Bloque 5: Backend Empresarial y Bases de Datos",
        "days": "Días 61-80",
        "icon": "🌐",
        "description": "PostgreSQL vs MongoDB, Pools de Conexiones, FastAPI asíncrono, SQLAlchemy Core, JWT y Docker Compose.",
        "lessons": [
            {
                "id": "b5_l1",
                "title": "5.1 PostgreSQL vs NoSQL & Connection Pools",
                "theory": """### Bases de Datos Relacionales vs NoSQL
* **PostgreSQL:** Cumplimiento ACID estricto. Ideal para datos con relaciones complejas e integridad financiera.
* **MongoDB:** Documental. Ideal para datos semiestructurados con alta tasa de escrituras.

### Connection Pools (Pools de Conexiones)
Crear una conexión TCP a base de datos consume tiempo. Un **Pool de Conexiones** mantiene un conjunto de sockets de conexión abiertos en memoria para reutilizarlos en las peticiones HTTP.""",
                "code_bad": """# Antipatrón: Crear una conexión TCP nueva por cada petición de usuario
import psycopg2

def obtener_datos():
    conn = psycopg2.connect("postgresql://user:pass@localhost/db")
    cursor = conn.cursor()
    cursor.execute("SELECT 1")
    conn.close()""",
                "code_good": """# Enfoque Optimizado: Pool de conexiones administrado
from sqlalchemy.ext.asyncio import create_async_engine

engine = create_async_engine(
    "postgresql+asyncpg://postgres:postgres@localhost:5433/python_master",
    pool_size=20,
    max_overflow=10
)""",
                "quiz": {
                    "question": "¿Qué problema resuelve el uso de un Pool de Conexiones en servidores web con alto tráfico?",
                    "options": [
                        "Evita la sobrecarga de tiempo de crear y destruir conexiones TCP a la base de datos por cada solicitud HTTP.",
                        "Convierte automáticamente SQL a NoSQL.",
                        "Elimina los errores de sintaxis en Python.",
                        "Permite conectar sin contraseña."
                    ],
                    "answer": 0,
                    "explanation": "El pool reutiliza conexiones abiertas en memoria, eliminando el latido de red (*handshake*) y acelerando drásticamente las respuestas de la API."
                },
                "exercise": {
                    "instructions": "Escribe una función `simular_pool_conexion(pool: list) -> str` que obtenga y retorne el primer elemento disponible del pool o `'No disponible'` si está vacío.",
                    "hints": """💡 **Atajos & Pistas de Resolución:**
* **Atajo 1 (Comprobación de Lista):** `if not pool:` o `if len(pool) == 0:` comprueba si la lista está vacía.
* **Atajo 2 (Extracción O(1)):** Retorna `pool[0]` o `pool.pop(0)` si hay elementos.""",
                    "solution_explanation": """🔍 **Explicación Paso a Paso del Código:**
1. `if not pool: return "No disponible"` -> Validamos si el pool no tiene sockets activos en memoria.
2. `return pool[0]` -> Retornamos la primera conexión lista para usar en O(1).""",
                    "starter_code": """def simular_pool_conexion(pool: list) -> str:
    # Tu código aquí
    pass
""",
                    "test_code": """
p = ["conn1", "conn2"]
assert simular_pool_conexion(p) == "conn1"
assert simular_pool_conexion([]) == "No disponible"
print("¡Simulación de Pool de conexión probada!")
"""
                }
            },
            {
                "id": "b5_l2",
                "title": "5.2 APIs RESTful Asíncronas con FastAPI & JWT",
                "theory": """### FastAPI & Autenticación JWT
FastAPI permite construir APIs asíncronas de alto rendimiento.
* **JWT (JSON Web Tokens):** Token firmado digitalmente que contiene la identidad y roles del usuario, permitiendo autenticación *stateless* (sin guardar estados de sesión en servidor).""",
                "code_bad": """# Endpoint síncrono bloqueante en servidor asíncrono
from fastapi import FastAPI
import time

app = FastAPI()

@app.get("/lento")
async def endpoint_lento():
    time.sleep(2)
    return {"status": "ok"}""",
                "code_good": """# Endpoint asíncrono no bloqueante
from fastapi import FastAPI
import asyncio

app = FastAPI()

@app.get("/rapido")
async def endpoint_rapido():
    await asyncio.sleep(2)
    return {"status": "ok"}""",
                "quiz": {
                    "question": "¿Qué caracteriza a la autenticación mediante JWT (JSON Web Tokens)?",
                    "options": [
                        "Es stateless: el servidor verifica la firma criptográfica del token sin requerir consultas de sesión a base de datos en cada petición.",
                        "Requiere guardar cada token en un archivo de texto en el servidor.",
                        "Solo funciona en redes locales sin internet.",
                        "Solo se puede usar con Django."
                    ],
                    "answer": 0,
                    "explanation": "La firma criptográfica del JWT permite al backend confiar en la identidad del usuario de forma descentralizada sin sobrecargar la base de datos."
                },
                "exercise": {
                    "instructions": "Escribe un endpoint handler `async def obtener_perfil_usuario(user_id: int) -> dict` que retorne `{'user_id': user_id, 'rol': 'admin'}`.",
                    "hints": """💡 **Atajos & Pistas de Resolución:**
* **Atajo 1 (Handler Asíncrono):** Declara la función con `async def`.
* **Atajo 2 (Retorno de Diccionario):** FastAPI convierte automáticamente los diccionarios retornados a formato JSON.""",
                    "solution_explanation": """🔍 **Explicación Paso a Paso del Código:**
1. `async def obtener_perfil_usuario(user_id: int) -> dict:` -> Definición del handler asíncrono.
2. `return {"user_id": user_id, "rol": "admin"}` -> Construimos el diccionario de respuesta serializado automáticamente a JSON.""",
                    "starter_code": """async def obtener_perfil_usuario(user_id: int) -> dict:
    # Retorna el diccionario del usuario
    pass
""",
                    "test_code": """
import asyncio
res = asyncio.run(obtener_perfil_usuario(42))
assert res == {'user_id': 42, 'rol': 'admin'}
print("¡Endpoint asíncrono validado!")
"""
                }
            },
            {
                "id": "b5_l3",
                "title": "5.3 Caching con Redis & Docker Compose",
                "theory": """### Caching con Redis
Redis es un almacén de estructura de datos en memoria clave-valor de ultra alta velocidad.

* **Patrón Cache-Aside:** La aplicación consulta primero en Redis. Si existe el valor (*cache hit*), lo retorne de inmediato. Si no existe (*cache miss*), lo lee de PostgreSQL, lo guarda en Redis con un tiempo de expiración (TTL) y lo devuelve.""",
                "code_bad": """# Consultar base de datos relacional pesada en cada petición repetida
def obtener_catalogo_bad(db):
    return db.query("SELECT * FROM productos_masivos")""",
                "code_good": """# Enfoque Optimizado: Cache-Aside con Redis
def obtener_catalogo_good(redis_client, db):
    cached = redis_client.get("catalogo")
    if cached: return cached
    data = db.query("SELECT * FROM productos_masivos")
    redis_client.setex("catalogo", 300, data)
    return data""",
                "quiz": {
                    "question": "¿Qué es el TTL (Time To Live) en una clave de Redis?",
                    "options": [
                        "El tiempo máximo en segundos antes de que Redis elimine automáticamente la clave de memoria para mantener los datos frescos.",
                        "El tamaño en megabytes de la base de datos.",
                        "El número de usuarios conectados simultáneamente.",
                        "El tiempo que tarda Docker en iniciar."
                    ],
                    "answer": 0,
                    "explanation": "El TTL le indica a Redis cuánto tiempo debe conservar un registro en memoria antes de expirarlo automáticamente para evitar datos obsoletos."
                },
                "exercise": {
                    "instructions": "Escribe una función `consultar_con_cache(cache: dict, clave: str, valor_default: str) -> str` que devuelva el valor de la clave si existe en `cache`, o agregue `valor_default` a `cache` y lo devuelva.",
                    "hints": """💡 **Atajos & Pistas de Resolución:**
* **Atajo 1 (Operador `in` en Dicts):** Comprueba si la clave está en el diccionario con `if clave in cache:`.
* **Atajo 2 (Asignación):** Si no está, asigna `cache[clave] = valor_default` y retorna el valor.""",
                    "solution_explanation": """🔍 **Explicación Paso a Paso del Código:**
1. `if clave in cache: return cache[clave]` -> Verificamos si hay un Cache Hit y retornamos de inmediato.
2. `cache[clave] = valor_default` -> En caso de Cache Miss, guardamos en la memoria del caché.
3. `return valor_default` -> Retornamos el valor recién cacheado.""",
                    "starter_code": """def consultar_con_cache(cache: dict, clave: str, valor_default: str) -> str:
    # Tu código aquí
    pass
""",
                    "test_code": """
c = {}
assert consultar_con_cache(c, "k1", "v1") == "v1"
assert c["k1"] == "v1"
assert consultar_con_cache(c, "k1", "v2") == "v1"
print("¡Lógica de Cache-Aside verificada!")
"""
                }
            }
        ]
    },
    {
        "id": "bloque_6",
        "title": "Bloque 6: Rendimiento, Testing de Carga y DevOps",
        "days": "Días 81-100",
        "icon": "🚀",
        "description": "Profiling (`cProfile`, `py-spy`), aceleración JIT con Numba, pruebas de carga con Locust y CI/CD en GitHub Actions.",
        "lessons": [
            {
                "id": "b6_l1",
                "title": "6.1 Profiling de CPU y Memoria con py-spy",
                "theory": """### Profiling de Código en Producción
* `cProfile`: Profiler determinista integrado. Rastrea cada llamada a función pero introduce sobrecarga.
* `py-spy`: Sampling profiler escrito en Rust. Examina la memoria de CPython desde fuera sin detener el servidor ni degradar el rendimiento, generando diagramas de llama (*Flame Graphs*).""",
                "code_bad": """# Intentar optimizar fragmentos de código por adivinanza sin medir con profilers
def algoritmo_adivinado():
    pass""",
                "code_good": """# Diagnóstico científico previo con py-spy
# Terminal: py-spy record -o profile.svg --pid 1234""",
                "quiz": {
                    "question": "¿Por qué `py-spy` se prefiere para realizar profiling en servidores de producción activos?",
                    "options": [
                        "Porque no requiere modificar el código fuente ni pausar la ejecución del servidor web.",
                        "Porque reescribe el código en Rust automáticamente.",
                        "Porque desactiva los errores de red.",
                        "Porque es el único profiler que soporta HTML."
                    ],
                    "answer": 0,
                    "explanation": "`py-spy` lee la memoria del intérprete CPython mediante llamadas del sistema operativo de bajo impacto sin ralentizar el servicio."
                },
                "exercise": {
                    "instructions": "Escribe una función `encontrar_maximo(numeros: list) -> int` y mide que retorne el número más grande de una lista.",
                    "hints": """💡 **Atajos & Pistas de Resolución:**
* **Atajo 1 (Función Nativa):** Python incluye la función `max(numeros)` optimizada en C que resuelve esto en tiempo O(N).
* **Atajo 2 (Alternativa Bucle):** Puedes usar un bucle guardando el elemento mayor visto hasta el momento.""",
                    "solution_explanation": """🔍 **Explicación Paso a Paso del Código:**
1. `def encontrar_maximo(numeros: list) -> int:` -> Recibe la lista de números.
2. `return max(numeros)` -> Invoca la función C nativa de Python que encuentra el máximo en un único paso lineal O(N).""",
                    "starter_code": """def encontrar_maximo(numeros: list) -> int:
    # Retorna el máximo
    pass
""",
                    "test_code": """
assert encontrar_maximo([3, 9, 1, 4]) == 9
assert encontrar_maximo([-5, -1, -10]) == -1
print("¡Función de búsqueda de máximo probada!")
"""
                }
            },
            {
                "id": "b6_l2",
                "title": "6.2 Aceleración JIT con Numba",
                "theory": """### Compilación Just-In-Time (JIT)
**Numba** traduce funciones numéricas de Python directamente a código de máquina nativo en tiempo de ejecución utilizando la infraestructura de compilación LLVM.

* `@jit(nopython=True)`: Fuerza a Numba a compilar el código sin intervención de la API de CPython, logrando velocidades comparables a C/C++.""",
                "code_bad": """# Bucle numérico nativo en CPython (Lento para millones de iteraciones)
def suma_cuadrados_python(n: int):
    total = 0
    for i in range(n): total += i * i
    return total""",
                "code_good": """# Aceleración nativa con Numba JIT (Hasta 50x más rápido)
from numba import jit

@jit(nopython=True, fastmath=True)
def suma_cuadrados_numba(n: int):
    total = 0
    for i in range(n): total += i * i
    return total""",
                "quiz": {
                    "question": "¿Qué realiza el parámetro `nopython=True` en el decorador `@jit` de Numba?",
                    "options": [
                        "Fuerza a Numba a compilar la función a código máquina puro sin depender del intérprete de CPython.",
                        "Convierte el código a JavaScript.",
                        "Borra el código fuente de Python.",
                        "Desactiva las pruebas unitarias."
                    ],
                    "answer": 0,
                    "explanation": "`nopython=True` garantiza la máxima velocidad compilando a código nativo sin sobrecarga del runtime de Python."
                },
                "exercise": {
                    "instructions": "Escribe la función `suma_vectorial(arr: list) -> int` que retorne la suma de todos los enteros en la lista.",
                    "hints": """💡 **Atajos & Pistas de Resolución:**
* **Atajo 1 (Función Nativa):** Usa `sum(arr)` para sumar todos los enteros en C nativo.
* **Atajo 2:** También puedes usar un acumulador en un bucle `total = 0; for x in arr: total += x`.""",
                    "solution_explanation": """🔍 **Explicación Paso a Paso del Código:**
1. `def suma_vectorial(arr: list) -> int:` -> Definición de la función de acumulación.
2. `return sum(arr)` -> Ejecuta la suma iterativa optimizada en C.""",
                    "starter_code": """def suma_vectorial(arr: list) -> int:
    # Tu código aquí
    pass
""",
                    "test_code": """
assert suma_vectorial([1, 2, 3, 4]) == 10
assert suma_vectorial([10, 20]) == 30
print("¡Cálculo de suma vectorial validado!")
"""
                }
            },
            {
                "id": "b6_l3",
                "title": "6.3 Testing de Carga (Locust) y CI/CD en GitHub Actions",
                "theory": """### Pruebas de Carga con Locust
Locust permite definir escenarios de prueba de carga mediante código Python para simular miles de usuarios concurrentes en la API.

### CI/CD en GitHub Actions
Los flujos de trabajo en `.github/workflows/ci.yml` automatizan la validación de calidad en cada Pull Request:
1. Linters sintácticos (`black`, `flake8`).
2. Análisis estático de tipos (`mypy --strict`).
3. Auditoría de seguridad (`Bandit`).
4. Pruebas automáticas (`pytest`).""",
                "code_bad": """# Desplegar a producción manualmente sin pruebas automáticas en CI/CD""",
                "code_good": """# Configuración automatizada CI/CD en GitHub Actions
# .github/workflows/ci.yml ejecuta 'pytest' y 'mypy' antes de autorizar el merge""",
                "quiz": {
                    "question": "¿Cuál es la función principal de un pipeline de CI/CD (Integración Continua) en software empresarial?",
                    "options": [
                        "Automatizar la ejecución de linters, análisis de seguridad y pruebas en cada cambio de código para evitar errores en producción.",
                        "Aumentar el precio del servidor.",
                        "Reemplazar a los desarrolladores Senior.",
                        "Generar claves de base de datos aleatorias."
                    ],
                    "answer": 0,
                    "explanation": "El pipeline de CI/CD actúa como un filtro de calidad automatizado que verifica que todo el código cumple con los estándares antes de desplegar."
                },
                "exercise": {
                    "instructions": "Define la función `verificar_estado_salud(status_code: int) -> bool` que devuelva `True` si el status code es 200.",
                    "hints": """💡 **Atajos & Pistas de Resolución:**
* **Atajo 1:** Compara directamente `status_code == 200` lo cual retorna `True` o `False` implícitamente.""",
                    "solution_explanation": """🔍 **Explicación Paso a Paso del Código:**
1. `def verificar_estado_salud(status_code: int) -> bool:` -> Recibe el código de respuesta HTTP.
2. `return status_code == 200` -> Evalúa la expresión de igualdad y devuelve el booleano resultante.""",
                    "starter_code": """def verificar_estado_salud(status_code: int) -> bool:
    return status_code == 200
""",
                    "test_code": """
assert verificar_estado_salud(200) == True
assert verificar_estado_salud(500) == False
print("¡Verificación de salud de CI/CD exitosa!")
"""
                }
            }
        ]
    }
]

ACHIEVEMENTS_LIST = [
    {"badge_key": "b1_master", "title": "Héroe de la Memoria", "description": "Completaste el Bloque 1 y dominas Stack, Heap y el GIL.", "icon": "🧠"},
    {"badge_key": "b2_master", "title": "Maestro del Data Model", "description": "Completaste el Bloque 2 y usas __slots__ y descriptores.", "icon": "⚙️"},
    {"badge_key": "b3_master", "title": "Señor de la Concurrencia", "description": "Completaste el Bloque 3 y dominas Asyncio y Procesos.", "icon": "⚡"},
    {"badge_key": "b4_master", "title": "Arquitecto de Software", "description": "Completaste el Bloque 4 con Pydantic y Protocolos.", "icon": "📐"},
    {"badge_key": "b5_master", "title": "Ingeniero Backend", "description": "Completaste el Bloque 5 conectando FastAPI a PostgreSQL.", "icon": "🌐"},
    {"badge_key": "b6_master", "title": "Senior+ Performance Staff", "description": "Completaste la ruta con Profiling y CI/CD.", "icon": "🚀"}
]
