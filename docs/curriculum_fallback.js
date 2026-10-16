window.CURRICULUM_FALLBACK = [
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
        "theory": "### Sintaxis y Gestión de Memoria en Python\nPython es un lenguaje interpretado, dinámico pero **fuertemente tipado**. Las variables no son contenedores de datos fijos, sino **punteros** que apuntan a objetos en la memoria Heap.\n\n* **Tipos Primitivos Inmutables:**\n  * `int`: Enteros de precisión arbitraria (`10`, `-5`).\n  * `float`: Números de coma flotante (`3.14159`).\n  * `str`: Cadenas de caracteres inmutables (`\"Hola Python\"`).\n  * `bool`: Valores booleanos (`True`, `False`).\n  * `NoneType`: Representa la ausencia de valor (`None`).\n\n### Casting e Inmutabilidad\nCuando modificas una variable entera o de texto, Python **no altera** el objeto en memoria, sino que crea un **nuevo objeto** en el Heap y mueve la referencia del puntero.",
        "code_bad": "# Antipatrón: Concatenación repetida de cadenas en bucle\ndef unir_cadenas_lento(lista_palabras):\n    resultado = \"\"\n    for palabra in lista_palabras:\n        resultado += palabra + \" \" # Ineficiente: Crea un nuevo string por cada iteración\n    return resultado",
        "code_good": "# Enfoque Optimizado (Pythonic Way)\ndef unir_cadenas_rapido(lista_palabras: list) -> str:\n    # join() asigna memoria una sola vez en CPython O(N)\n    return \" \".join(lista_palabras)",
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
          "hints": "💡 **Atajos & Pistas de Resolución:**\n* **Atajo 1 (Operaciones Aritméticas):** Recuerda usar `/` para división flotante exacta `(celsius * 9/5) + 32`.\n* **Atajo 2 (Construcción de Diccionarios):** Puedes construir y retornar el diccionario directamente en una sola línea `return {'fahrenheit': ..., 'kelvin': ...}`.\n* **Caso Borde:** La temperatura en Kelvin no puede ser negativa en la física real, pero matemáticamente sumamos `273.15` a la entrada.",
          "solution_explanation": "🔍 **Explicación Paso a Paso del Código:**\n1. `def convertir_temperatura(celsius: float) -> dict:` -> Definimos la función indicando anotaciones de tipo (`float` entrada, `dict` retorno).\n2. `f = (celsius * 9 / 5) + 32` -> Calculamos la conversión a Fahrenheit aplicando la precedencia de operadores.\n3. `k = celsius + 273.15` -> Calculamos Kelvin sumando la constante estándar.\n4. `return {\"fahrenheit\": f, \"kelvin\": k}` -> Construimos y retornamos un objeto diccionario nativo en O(1).",
          "starter_code": "def convertir_temperatura(celsius: float) -> dict:\n    # Tu código aquí\n    pass\n",
          "puzzle_pieces": [
            "def convertir_temperatura(celsius: float) -> dict:",
            "    f = (celsius * 9 / 5) + 32",
            "    k = celsius + 273.15",
            "    return {'fahrenheit': f, 'kelvin': k}"
          ],
          "puzzle_distractors": [
            "    return [f, k]",
            "    f = celsius * 9 / 5"
          ],
          "test_code": "\nres = convertir_temperatura(0.0)\nassert res['fahrenheit'] == 32.0, f\"Esperado 32.0, obtenido {res.get('fahrenheit')}\"\nassert res['kelvin'] == 273.15, f\"Esperado 273.15, obtenido {res.get('kelvin')}\"\nprint(\"¡Conversión de temperatura correcta!\")\n"
        }
      },
      {
        "id": "b1_l2",
        "title": "1.2 Control de Flujo, Condicionales e Iteraciones",
        "theory": "### Estructuras de Control de Flujo\n* **Condicionales:** `if`, `elif`, `else`. Evaluaciones booleanas de valores (*truthy* / *falsy*).\n* **Bucles:** `for` (iteración sobre secuencias e iterables) y `while` (bucle basado en condición).\n\n### Funciones Nativas de Iteración\n* `enumerate(iterable)`: Devuelve pares `(índice, elemento)`.\n* `zip(iter1, iter2)`: Combina múltiples iterables en tuplas de forma paralela.\n* `range(start, stop, step)`: Genera secuencias numéricas sin cargarlas completamente en memoria.",
        "code_bad": "# Antipatrón: Iterar usando rangos de índices manualmente\nfrutas = [\"Manzana\", \"Banana\", \"Cereza\"]\nfor i in range(len(frutas)):\n    print(i, frutas[i])",
        "code_good": "# Enfoque Optimizado: Uso de enumerate()\nfrutas = [\"Manzana\", \"Banana\", \"Cereza\"]\nfor indice, fruta in enumerate(frutas):\n    print(f\"{indice}: {fruta}\")",
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
          "hints": "💡 **Atajos & Pistas de Resolución:**\n* **Atajo 1 (Casos Especiales):** Los números menores o iguales a 1 (`<= 1`) NO son primos. Retorna `False` de inmediato.\n* **Atajo 2 (Optimización Matemática):** No necesitas probar divisores hasta `numero`. Basta con probar divisores desde `2` hasta la raíz cuadrada `int(numero**0.5) + 1`.\n* **Atajo 3 (Operador Módulo `%`):** `numero % i == 0` indica que `i` es un divisor exacto.",
          "solution_explanation": "🔍 **Explicación Paso a Paso del Código:**\n1. `if numero <= 1: return False` -> Descartamos 0, 1 y negativos ya que por definición los primos son mayores a 1.\n2. `for i in range(2, int(numero**0.5) + 1):` -> Iteramos solo hasta la raíz cuadrada optimizando el algoritmo de O(N) a O(sqrt(N)).\n3. `if numero % i == 0: return False` -> Si encontramos algún divisor que deje residuo cero, confirmamos que es compuesto y cortamos la ejecución.\n4. `return True` -> Si ningún número dividió exactamente, confirmamos que es primo.",
          "starter_code": "def es_primo(numero: int) -> bool:\n    # Tu código aquí\n    pass\n",
          "puzzle_pieces": [
            "def es_primo(numero: int) -> bool:",
            "    if numero <= 1:",
            "        return False",
            "    for i in range(2, int(numero**0.5) + 1):",
            "        if numero % i == 0:",
            "            return False",
            "    return True"
          ],
          "puzzle_distractors": [
            "    if numero == 1: return True",
            "    for i in range(2, numero):"
          ],
          "test_code": "\nassert es_primo(7) == True, \"7 debería ser primo\"\nassert es_primo(10) == False, \"10 no debería ser primo\"\nassert es_primo(1) == False, \"1 no es primo\"\nprint(\"¡Detector de números primos verificado!\")\n"
        }
      },
      {
        "id": "b1_l3",
        "title": "1.3 Colecciones Nativas & Comprehensions",
        "theory": "### Colecciones Principales en Python\n1. **Listas (`list`):** Secuencia ordenada y mutable `[1, 2, 3]`.\n2. **Tuplas (`tuple`):** Secuencia ordenada e inmutable `(1, 2, 3)`. Menor peso en memoria.\n3. **Conjuntos (`set`):** Colección desordenada de elementos únicos `{1, 2, 3}`. Búsquedas O(1).\n4. **Diccionarios (`dict`):** Pares clave-valor `{\"id\": 1}`. Búsquedas O(1) basadas en hash.\n\n### Comprehensions\nPermiten construir colecciones de forma concisa y rápida directamente en CPython.\n* Dict Comprehension: `{k: v for k, v in iterable if condicion}`",
        "code_bad": "# Antipatrón: Construir un diccionario filtrado mediante bucles tradicionales\nprecios = {\"laptop\": 1200, \"mouse\": 25, \"teclado\": 80, \"monitor\": 300}\ncaros = {}\nfor prod, precio in precios.items():\n    if precio > 100:\n        caros[prod] = precio",
        "code_good": "# Enfoque Optimizado: Dict Comprehension\nprecios = {\"laptop\": 1200, \"mouse\": 25, \"teclado\": 80, \"monitor\": 300}\ncaros = {prod: precio for prod, precio in precios.items() if precio > 100}",
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
          "hints": "💡 **Atajos & Pistas de Resolución:**\n* **Atajo 1 (List Comprehension):** La sintaxis es `[expresion for elemento in iterable if condicion]`.\n* **Atajo 2 (Operador Par `% 2`):** Un número `n` es par si `n % 2 == 0`.\n* **Atajo 3 (Exponente `**`):** El cuadrado de `x` se escribe `x ** 2` o `x * x`.",
          "solution_explanation": "🔍 **Explicación Paso a Paso del Código:**\n1. `return [x**2 for x in numeros if x % 2 == 0]` -> Creamos una lista filtrada en un único paso.\n2. `for x in numeros` -> Recorre secuencialmente cada número del argumento.\n3. `if x % 2 == 0` -> Filtra únicamente los enteros pares.\n4. `x**2` -> Eleva cada entero filtrado al cuadrado y lo inserta en la nueva lista devuelta en memoria.",
          "starter_code": "def filtrar_pares_cuadrados(numeros: list) -> list:\n    # Tu solución con list comprehension\n    pass\n",
          "puzzle_pieces": [
            "def filtrar_pares_cuadrados(numeros: list) -> list:",
            "    return [x**2 for x in numeros if x % 2 == 0]"
          ],
          "puzzle_distractors": [
            "    return [x for x in numeros if x % 2 == 0]",
            "    return [x**2 for x in numeros if x % 2 != 0]"
          ],
          "test_code": "\nres = filtrar_pares_cuadrados([1, 2, 3, 4, 5, 6])\nassert res == [4, 16, 36], f\"Esperado [4, 16, 36], obtenido {res}\"\nprint(\"¡List comprehension validado!\")\n"
        }
      },
      {
        "id": "b1_l4",
        "title": "1.4 Memoria en CPython (Stack vs Heap) y el GIL",
        "theory": "### Gestión de Memoria en CPython\n* **Stack (Pila):** Guarda los marcos de ejecución de funciones y las variables locales (punteros a objetos).\n* **Heap (Montículo):** Región de memoria dinámica donde CPython crea los objetos. Cada objeto contiene un contador de referencias (`ob_refcnt`).\n* **Garbage Collector:** Cuando `ob_refcnt` cae a 0, la memoria del objeto se libera de inmediato. Para ciclos de referencias circulares, Python usa un recolección generacional (generaciones 0, 1 y 2).\n\n### El Global Interpreter Lock (GIL)\nEs un mutex que garantiza que solo un hilo nativo ejecute bytecode de Python a la vez en CPython, protegiendo la gestión de memoria interna.",
        "code_bad": "# Antipatrón: Argumento mutable por defecto en función\ndef registrar_evento(evento: str, log: list = []):\n    log.append(evento)\n    return log",
        "code_good": "# Enfoque Optimizado: Uso de None como valor centinela\ndef registrar_evento_optimo(evento: str, log: list = None) -> list:\n    if log is None:\n        log = [] # Instancia limpia en el Heap por llamada\n    log.append(evento)\n    return log",
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
          "hints": "💡 **Atajos & Pistas de Resolución:**\n* **Atajo 1 (Múltiplo de 15):** Evalúa PRIMERO la condición `i % 15 == 0` (o `i % 3 == 0 and i % 5 == 0`) antes de evaluar 3 o 5 por separado.\n* **Atajo 2 (Casting `str()`):** Convierte los enteros a cadena con `str(i)` cuando no sean múltiplos de 3 o 5.\n* **Atajo 3 (Bucle `range`):** Usa `range(1, n + 1)` para incluir el número `n`.",
          "solution_explanation": "🔍 **Explicación Paso a Paso del Código:**\n1. `res = []` -> Inicializamos la lista de resultados.\n2. `for i in range(1, n + 1):` -> Generamos la secuencia del 1 al `n` inclusive.\n3. `if i % 15 == 0: res.append(\"FizzBuzz\")` -> Evaluamos la divisibilidad simultánea entre 3 y 5.\n4. `elif i % 3 == 0: res.append(\"Fizz\")` / `elif i % 5 == 0: res.append(\"Buzz\")` -> Evaluamos divisibilidad individual.\n5. `else: res.append(str(i))` -> Si no cumple ninguna condición anterior, convertimos el número a string.",
          "starter_code": "def fizz_buzz(n: int) -> list:\n    # Tu código aquí\n    pass\n",
          "puzzle_pieces": [
            "def fizz_buzz(n: int) -> list:",
            "    res = []",
            "    for i in range(1, n + 1):",
            "        if i % 15 == 0: res.append('FizzBuzz')",
            "        elif i % 3 == 0: res.append('Fizz')",
            "        elif i % 5 == 0: res.append('Buzz')",
            "        else: res.append(str(i))",
            "    return res"
          ],
          "puzzle_distractors": [
            "    for i in range(n):",
            "        if i % 3 == 0: res.append('FizzBuzz')"
          ],
          "test_code": "\nres = fizz_buzz(5)\nassert res == ['1', '2', 'Fizz', '4', 'Buzz'], f\"Obtenido {res}\"\nassert fizz_buzz(15)[14] == 'FizzBuzz'\nprint(\"¡FizzBuzz verificado!\")\n"
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
        "theory": "### Programación Orientada a Objetos en Python\n* **Clases y Objetos:** Una clase es la plantilla que define atributos y métodos. Un objeto es la instancia viva en el Heap.\n* **Encapsulamiento:** Convenio de nombres en Python:\n  * `_atributo`: Atributo protegido (por convención, uso interno).\n  * `__atributo`: Atributo privado (Python aplica *Name Mangling* `_Clase__atributo`).\n* **Herencia y `super()`:** Permite a una subclase reutilizar y extender el comportamiento de una clase padre.",
        "code_bad": "# Antipatrón: Acceso directo inseguro a atributos sensibles\nclass CuentaBancariaInsegura:\n    def __init__(self, saldo):\n        self.saldo = saldo",
        "code_good": "# Enfoque Optimizado: Encapsulamiento con getters/setters y propiedades\nclass CuentaBancaria:\n    def __init__(self, saldo_inicial: float):\n        self._saldo = max(0.0, saldo_inicial)\n\n    @property\n    def saldo(self) -> float:\n        return self._saldo\n\n    def depositar(self, monto: float):\n        if monto > 0:\n            self._saldo += monto",
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
          "hints": "💡 **Atajos & Pistas de Resolución:**\n* **Atajo 1 (Atributo Privado):** Almacena el saldo en un atributo protegido `self._saldo`.\n* **Atajo 2 (Decorador `@property`):** Define `saldo` como propiedad `@property def saldo(self): return self._saldo`.\n* **Atajo 3 (Método `depositar`):** Suma el monto recibido a `self._saldo` solo si `monto > 0`.",
          "solution_explanation": "🔍 **Explicación Paso a Paso del Código:**\n1. `def __init__(self, saldo_inicial: float): self._saldo = saldo_inicial` -> Inicializamos la instancia protegiendo el saldo en `_saldo`.\n2. `@property def saldo(self): return self._saldo` -> Permitimos consultar el saldo como atributo `c.saldo` de solo lectura limpia.\n3. `def depositar(self, monto: float): self._saldo += monto` -> Modificamos el estado interno aumentando el saldo disponible.",
          "starter_code": "class CuentaBancaria:\n    def __init__(self, saldo_inicial: float):\n        # Tu código aquí\n        pass\n",
          "test_code": "\nc = CuentaBancaria(100.0)\nc.depositar(50.0)\nassert c.saldo == 150.0, f\"Esperado 150.0, obtenido {c.saldo}\"\nprint(\"¡Clase CuentaBancaria validada!\")\n"
        }
      },
      {
        "id": "b2_l2",
        "title": "2.2 El Modelo de Datos (`dunder methods`) y __slots__",
        "theory": "### El Modelo de Datos de Python\nPermite personalizar el comportamiento de tus clases ante operadores nativos (`+`, `len()`, `str()`, `[]`).\n\n* `__str__`: Representación legible para usuarios.\n* `__repr__`: Representación inequívoca para desarrolladores.\n* `__len__`: Retorna la longitud del objeto.\n* `__getitem__`: Permite indexar con corchetes `objeto[idx]`.\n\n### Optimización de Memoria con `__slots__`\nPor defecto cada instancia tiene un `__dict__` dinámico. Definir `__slots__ = ('x', 'y')` elimina el `__dict__` reduciendo el peso en memoria hasta un 70%.",
        "code_bad": "# Clase tradicional con __dict__ (Consumo alto de memoria)\nclass PuntoNormal:\n    def __init__(self, x, y):\n        self.x = x\n        self.y = y",
        "code_good": "# Clase optimizada con __slots__ y sobrecarga de operador suma\nclass Vector2D:\n    __slots__ = ('x', 'y')\n    def __init__(self, x: float, y: float):\n        self.x = x\n        self.y = y\n\n    def __add__(self, otro: 'Vector2D') -> 'Vector2D':\n        return Vector2D(self.x + otro.x, self.y + otro.y)",
        "quiz": {
          "question": "¿Qué método mágico debes implementar para permitir que tu clase responda al operador de suma `+`?",
          "options": [
            "__sum__",
            "__add__",
            "__plus__",
            "__concat__"
          ],
          "answer": 1,
          "explanation": "El método `__add__(self, other)` es invocado internamente por CPython cuando se utiliza el operador `+` entre dos objetos."
        },
        "exercise": {
          "instructions": "Crea una clase `Vector2D` con `__slots__ = ('x', 'y')` e implementa `__add__` para sumar dos vectores.",
          "hints": "💡 **Atajos & Pistas de Resolución:**\n* **Atajo 1 (`__slots__`):** Define `__slots__ = ('x', 'y')` justo al inicio de la clase.\n* **Atajo 2 (`__add__`):** El método mágico `__add__(self, otro)` debe retornar una NUEVA instancia de `Vector2D(self.x + otro.x, self.y + otro.y)`.\n* **Atajo 3 (Constructores):** Accede a las coordenadas directamente con `self.x` y `otro.x`.",
          "solution_explanation": "🔍 **Explicación Paso a Paso del Código:**\n1. `__slots__ = ('x', 'y')` -> Elimina el `__dict__` optimizando memoria en el Heap CPython.\n2. `def __init__(self, x: float, y: float): self.x = x; self.y = y` -> Asigna las coordenadas iniciales.\n3. `def __add__(self, otro): return Vector2D(self.x + otro.x, self.y + otro.y)` -> Sobrecarga el operador `+` creando una nueva instancia resultado.",
          "starter_code": "class Vector2D:\n    __slots__ = ('x', 'y')\n    def __init__(self, x: float, y: float):\n        self.x = x\n        self.y = y\n    # Implementa __add__\n",
          "test_code": "\nv1 = Vector2D(1.0, 2.0)\nv2 = Vector2D(3.0, 4.0)\nv3 = v1 + v2\nassert v3.x == 4.0 and v3.y == 6.0, f\"Esperado (4.0, 6.0), obtenido ({v3.x}, {v3.y})\"\nprint(\"¡Sobrecarga de operador suma en Vector2D validada!\")\n"
        }
      },
      {
        "id": "b2_l3",
        "title": "2.3 Descriptores, Protocolos y Context Managers",
        "theory": "### Protocolos Nativos\n* **Context Manager (`with`):** Requiere `__enter__()` (inicialización) y `__exit__()` (limpieza automática de recursos).\n\n### Protocolo Descriptor\nUn descriptor es una clase que controla el acceso a un atributo en otra clase implementando `__get__()`, `__set__()` o `__delete__()`. Es la base de `@property`, `@classmethod` y los ORMs.",
        "code_bad": "# Gestión manual insegura de archivos sin context manager\nf = open(\"datos.txt\", \"w\")\nf.write(\"hola\")",
        "code_good": "# Enfoque Optimizado: Context Manager nativo con 'with'\nwith open(\"datos.txt\", \"w\") as f:\n    f.write(\"hola\")",
        "quiz": {
          "question": "¿Qué método de un Context Manager se ejecuta automáticamente al salir de un bloque `with`, garantizando la liberación de recursos?",
          "options": [
            "__close__",
            "__exit__",
            "__stop__",
            "__finally__"
          ],
          "answer": 1,
          "explanation": "El método `__exit__(self, exc_type, exc_val, exc_tb)` se invoca siempre al finalizar el bloque `with`, gestionando excepciones si las hubiera."
        },
        "exercise": {
          "instructions": "Crea una clase `Temporizador` que funcione como Context Manager (`__enter__` y `__exit__`) guardando el tiempo transcurrido en el atributo `tiempo_total`.",
          "hints": "💡 **Atajos & Pistas de Resolución:**\n* **Atajo 1 (`__enter__`):** Guarda `self.inicio = time.time()` y retorna `self`.\n* **Atajo 2 (`__exit__`):** Calcula `self.tiempo_total = time.time() - self.inicio`.\n* **Atajo 3 (`time.time()`):** Importa el módulo `time` para medir las marcas de tiempo en segundos.",
          "solution_explanation": "🔍 **Explicación Paso a Paso del Código:**\n1. `def __enter__(self): self.inicio = time.time(); return self` -> Guarda la marca de tiempo de inicio al entrar al bloque `with` y se retorna a sí misma.\n2. `def __exit__(self, exc_type, exc_val, exc_tb): self.tiempo_total = time.time() - self.inicio` -> Calcula la diferencia temporal al salir del bloque garantizando la medición.",
          "starter_code": "import time\n\nclass Temporizador:\n    def __enter__(self):\n        self.inicio = time.time()\n        return self\n    def __exit__(self, exc_type, exc_val, exc_tb):\n        self.tiempo_total = time.time() - self.inicio\n",
          "test_code": "\nwith Temporizador() as t:\n    time.sleep(0.1)\nassert t.tiempo_total >= 0.09, \"El temporizador debe registrar el tiempo\"\nprint(\"¡Context Manager Temporizador verificado!\")\n"
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
        "theory": "### Hilos en CPython (`threading`)\nLos hilos en Python son hilos del sistema operativo. Debido al **GIL**, no pueden ejecutar bytecode de Python en paralelo en múltiples núcleos.\n\n* **Caso de uso óptimo:** Operaciones de entrada/salida (I/O-bound) como descargar páginas web, consultar bases de datos o leer archivos de disco. Durante el I/O, CPython **libera el GIL**.\n* **Sincronización:** Uso de `threading.Lock()` para prevenir condiciones de carrera al modificar datos compartidos.",
        "code_bad": "# Antipatrón: Condición de carrera al modificar estado global desde múltiples hilos\nimport threading\n\ncontador = 0\ndef incrementar_inseguro():\n    global contador\n    for _ in range(100000):\n        contador += 1",
        "code_good": "# Enfoque Optimizado: Protección con Lock\nimport threading\n\ncontador = 0\nlock = threading.Lock()\n\ndef incrementar_seguro():\n    global contador\n    for _ in range(100000):\n        with lock:\n            contador += 1",
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
          "hints": "💡 **Atajos & Pistas de Resolución:**\n* **Atajo 1 (Creación de Hilos):** `t = threading.Thread(target=func)`.\n* **Atajo 2 (Inicio y Sincronización):** Llama a `t.start()` para iniciar y a `t.join()` en una lista de hilos para bloquear hasta que todos terminen.\n* **Atajo 3 (Lista de Hilos):** Guarda cada hilo en una lista `hilos = []` para iterar y hacer `.join()`.",
          "solution_explanation": "🔍 **Explicación Paso a Paso del Código:**\n1. `hilos = [threading.Thread(target=func) for _ in range(veces)]` -> Instanciamos los hilos requeridos indicando la función objetivo.\n2. `for t in hilos: t.start()` -> Iniciamos la ejecución concurrente de cada hilo en el sistema operativo.\n3. `for t in hilos: t.join()` -> Sincronizamos la salida garantizando que la función padre espere el término de todos los hilos.",
          "starter_code": "import threading\n\ndef ejecutar_hilos_paralelos(func, veces: int):\n    # Tu código de hilos aquí\n    pass\n",
          "test_code": "\nresultado = []\ndef tarea():\n    resultado.append(1)\n\nejecutar_hilos_paralelos(tarea, 5)\nassert len(resultado) == 5, f\"Esperado 5 elementos, obtenido {len(resultado)}\"\nprint(\"¡Ejecución de hilos en paralelo verificada!\")\n"
        }
      },
      {
        "id": "b3_l2",
        "title": "3.2 Multiprocessing (CPU-Bound)",
        "theory": "### Paralelismo con `multiprocessing`\nPara tareas intensivas en CPU (procesamiento de imágenes, matemáticas pesadas), se deben crear **procesos independientes**. Cada proceso tiene su propio intérprete de CPython y su propio GIL.\n\n* `ProcessPoolExecutor`: Administra un pool de procesos paralelos.\n* IPC (Comunicación interprocesos): Los procesos no comparten memoria. Se comunican mediante `Queue` o `Pipe` serializando objetos con `pickle`.",
        "code_bad": "# Ineficiente: Procesar grandes cálculos numéricos en un solo hilo\ndef calcular_cuadrados_lento(numeros):\n    return [x**2 for x in numeros]",
        "code_good": "# Optimizado: Distribución de carga en múltiples núcleos\nfrom concurrent.futures import ProcessPoolExecutor\n\ndef cuadrado(x):\n    return x**2\n\ndef calcular_cuadrados_paralelo(numeros):\n    with ProcessPoolExecutor() as executor:\n        return list(executor.map(cuadrado, numeros))",
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
          "hints": "💡 **Atajos & Pistas de Resolución:**\n* **Atajo 1:** Es una función simple de nivel superior que retorna `n * n` o `n ** 2`.\n* **Atajo 2 (Serialización Pickle):** Las funciones pasadas a `multiprocessing` deben estar definidas en el módulo superior para ser serializables por `pickle`.",
          "solution_explanation": "🔍 **Explicación Paso a Paso del Código:**\n1. `def cuadrado_numero(n: int) -> int:` -> Definición simple de la función pura.\n2. `return n * n` -> Devuelve la multiplicación escalar sin efectos colaterales de memoria compartida.",
          "starter_code": "def cuadrado_numero(n: int) -> int:\n    return n * n\n",
          "test_code": "\nassert cuadrado_numero(4) == 16\nassert cuadrado_numero(9) == 81\nprint(\"¡Función de proceso probada!\")\n"
        }
      },
      {
        "id": "b3_l3",
        "title": "3.3 Concurrencia Asíncrona Cooperativa con Asyncio",
        "theory": "### Asyncio y el Bucle de Eventos (Event Loop)\nAsyncio permite concurrencia masiva en un solo hilo mediante programación asíncrona cooperativa.\n\n* **Corrutina (`async def`):** Función especial que se puede pausar y reanudar.\n* **`await`:** Pausa la corrutina actual y devuelve el control al Event Loop para que ejecute otras tareas mientras espera E/S.\n* `asyncio.gather(*tasks)`: Ejecuta múltiples corrutinas simultáneamente.",
        "code_bad": "# Petición bloqueante tradicional dentro de código asíncrono\nimport time\n\nasync def tarea_bad():\n    time.sleep(1) # ¡CRÍTICO! Bloquea todo el Event Loop",
        "code_good": "# Enfoque Optimizado: Pausa cooperativa no bloqueante\nimport asyncio\n\nasync def tarea_good():\n    await asyncio.sleep(1) # Cede el control al Event Loop",
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
          "hints": "💡 **Atajos & Pistas de Resolución:**\n* **Atajo 1 (Sintaxis Asíncrona):** Usa la palabra clave `async def` para declarar la corrutina.\n* **Atajo 2 (`await`):** Antepon la palabra `await` a `asyncio.sleep(0.05)`.\n* **Atajo 3 (Retorno):** Retorna la suma `a + b` al finalizar el await.",
          "solution_explanation": "🔍 **Explicación Paso a Paso del Código:**\n1. `async def sumar_async(a: int, b: int) -> int:` -> Declaramos la corrutina asíncrona.\n2. `await asyncio.sleep(0.05)` -> Pausamos la corrutina cediendo voluntariamente el control al Event Loop por 50 milisegundos.\n3. `return a + b` -> Retornamos el resultado de la suma una vez que el Event Loop reanuda la ejecución.",
          "starter_code": "import asyncio\n\nasync def sumar_async(a: int, b: int) -> int:\n    # Tu corrutina aquí\n    pass\n",
          "test_code": "\nimport asyncio\nres = asyncio.run(sumar_async(5, 15))\nassert res == 20, f\"Esperado 20, obtenido {res}\"\nprint(\"¡Corrutina asíncrona verificada!\")\n"
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
        "theory": "### Protocolos y Tipado Estructural\nEn lugar de heredar de clases base abstractas (`ABC`), `typing.Protocol` permite tipado estructural (Duck Typing verificado estáticamente por Mypy).\n\n### Genéricos (`TypeVar`)\nPermiten parametrizar tipos de datos manteniendo la seguridad de tipos estática en clases o repositorios reutilizables.",
        "code_bad": "# Acoplamiento directo sin contratos de tipo\nclass ServicioMySQL:\n    def guardar(self, datos):\n        print(\"Guardando en MySQL\")",
        "code_good": "# Uso de Protocol para desacoplamiento\nfrom typing import Protocol\n\nclass ContratoGuardado(Protocol):\n    def guardar(self, datos: dict) -> None:\n        ...\n\nclass ServicioMySQLOptimizado:\n    def guardar(self, datos: dict) -> None:\n        print(\"Guardando en MySQL\")",
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
          "hints": "💡 **Atajos & Pistas de Resolución:**\n* **Atajo 1 (BaseModel):** La clase debe heredar de `pydantic.BaseModel`.\n* **Atajo 2 (Definición de Campos):** Define las variables con sus anotaciones estáticas directamente en el cuerpo de la clase: `id: int`, `nombre: str`, `precio: float`.",
          "solution_explanation": "🔍 **Explicación Paso a Paso del Código:**\n1. `from pydantic import BaseModel` -> Importamos la clase base de Pydantic v2.\n2. `class Producto(BaseModel):` -> Definimos el modelo de transferencia de datos (DTO).\n3. `id: int`, `nombre: str`, `precio: float` -> Pydantic compila estas declaraciones en validadores de tiempo de ejecución en Rust.",
          "starter_code": "from pydantic import BaseModel\n\nclass Producto(BaseModel):\n    # Define los tipos aquí\n    pass\n",
          "test_code": "\np = Producto(id=10, nombre=\"Laptop\", precio=999.99)\nassert p.id == 10 and p.nombre == \"Laptop\"\nprint(\"¡Modelo Pydantic v2 validado!\")\n"
        }
      },
      {
        "id": "b4_l2",
        "title": "4.2 Patrones de Diseño a la Pythónica",
        "theory": "### Patrones de Diseño en Python\n* **Repository Pattern:** Desacopla la lógica de negocio pura de los detalles de almacenamiento (SQL, NoSQL, API externa).\n* **Factory Pattern:** En Python las clases son objetos de primera clase. Se pueden almacenar en diccionarios para instanciarlas dinámicamente sin jerarquías rígidas de fábricas.\n* **Singleton:** Se implementa de forma sencilla usando módulos (los módulos en Python se importan una sola vez en `sys.modules`).",
        "code_bad": "# Antipatrón: Instanciación rígida mediante sentencias if/else extensas\ndef crear_notificador_malo(tipo):\n    if tipo == \"email\": return NotificadorEmail()\n    elif tipo == \"sms\": return NotificadorSMS()",
        "code_good": "# Enfoque Optimizado: Mapeo de fábrica dinámico a la Pythónica\nCLASES_NOTIFICADOR = {\n    \"email\": NotificadorEmail,\n    \"sms\": NotificadorSMS\n}\n\ndef crear_notificador_optimizado(tipo: str):\n    cls = CLASES_NOTIFICADOR.get(tipo)\n    if not cls: raise ValueError(\"Desconocido\")\n    return cls()",
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
          "hints": "💡 **Atajos & Pistas de Resolución:**\n* **Atajo 1 (Funciones de Primera Clase):** Retorna el nombre de la función SIN paréntesis (ej. `return sumar`), no el resultado de invocarla.\n* **Atajo 2 (Diccionario de Fábrica):** Usa un mapa `ops = {'suma': sumar, 'resta': restar}` y retorna `ops.get(tipo)`.",
          "solution_explanation": "🔍 **Explicación Paso a Paso del Código:**\n1. `def sumar(a, b): return a + b` / `def restar(a, b): return a - b` -> Definimos funciones puras simples.\n2. `ops = {'suma': sumar, 'resta': restar}` -> Creamos la tabla de despacho de funciones.\n3. `return ops.get(tipo)` -> Retornamos la referencia directa a la función solicitada.",
          "starter_code": "def sumar(a, b): return a + b\ndef restar(a, b): return a - b\n\ndef fabrica_operaciones(tipo: str):\n    # Tu lógica aquí\n    pass\n",
          "test_code": "\nfn_suma = fabrica_operaciones('suma')\nassert fn_suma(10, 5) == 15, \"Fábrica debería retornar función sumar\"\nfn_resta = fabrica_operaciones('resta')\nassert fn_resta(10, 5) == 5, \"Fábrica debería retornar función restar\"\nprint(\"¡Fábrica funcional validada!\")\n"
        }
      },
      {
        "id": "b4_l3",
        "title": "4.3 Pydantic v2 & Testing Automatizado con Pytest",
        "theory": "### Testing Moderno con Pytest\n* **Fixtures:** Permite preparar estados y recursos de prueba reutilizables (`@pytest.fixture`).\n* **Parametrización:** `@pytest.mark.parametrize` ejecuta la misma prueba con múltiples conjuntos de datos de entrada.\n* **Mocking:** Reemplaza llamados externos o consultas de base de datos pesadas por respuestas simuladas rápidas.",
        "code_bad": "# Pruebas unitarias lentas que dependen de red o base de datos real\ndef test_pago():\n    respuesta = conectar_api_pasarela_real_stripe() # Lento e inestable\n    assert respuesta.status == 200",
        "code_good": "# Pruebas unitarias aisladas con Mocks\nfrom unittest.mock import MagicMock\n\ndef test_pago_mock():\n    pasarela_mock = MagicMock()\n    pasarela_mock.cobrar.return_value = {\"status\": \"exito\"}\n    res = pasarela_mock.cobrar(100)\n    assert res[\"status\"] == \"exito\" ",
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
          "hints": "💡 **Atajos & Pistas de Resolución:**\n* **Atajo 1 (Operador `in`):** Devuelve `True` directamente evaluando `\"@\" in email and \".\" in email`.\n* **Atajo 2 (Cadenas):** Las búsquedas de subcadenas con `in` se ejecutan en tiempo O(N) muy optimizado en CPython.",
          "solution_explanation": "🔍 **Explicación Paso a Paso del Código:**\n1. `def validar_email(email: str) -> bool:` -> Recibe la cadena a validar.\n2. `return \"@\" in email and \".\" in email` -> Realiza ambas comprobaciones booleanas combinadas con el operador lógico `and`.",
          "starter_code": "def validar_email(email: str) -> bool:\n    return \"@\" in email and \".\" in email\n",
          "test_code": "\nassert validar_email(\"test@example.com\") == True\nassert validar_email(\"invalid_email\") == False\nprint(\"¡Prueba de validación completada!\")\n"
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
        "theory": "### Bases de Datos Relacionales vs NoSQL\n* **PostgreSQL:** Cumplimiento ACID estricto. Ideal para datos con relaciones complejas e integridad financiera.\n* **MongoDB:** Documental. Ideal para datos semiestructurados con alta tasa de escrituras.\n\n### Connection Pools (Pools de Conexiones)\nCrear una conexión TCP a base de datos consume tiempo. Un **Pool de Conexiones** mantiene un conjunto de sockets de conexión abiertos en memoria para reutilizarlos en las peticiones HTTP.",
        "code_bad": "# Antipatrón: Crear una conexión TCP nueva por cada petición de usuario\nimport psycopg2\n\ndef obtener_datos():\n    conn = psycopg2.connect(\"postgresql://user:pass@localhost/db\")\n    cursor = conn.cursor()\n    cursor.execute(\"SELECT 1\")\n    conn.close()",
        "code_good": "# Enfoque Optimizado: Pool de conexiones administrado\nfrom sqlalchemy.ext.asyncio import create_async_engine\n\nengine = create_async_engine(\n    \"postgresql+asyncpg://postgres:postgres@localhost:5433/python_master\",\n    pool_size=20,\n    max_overflow=10\n)",
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
          "hints": "💡 **Atajos & Pistas de Resolución:**\n* **Atajo 1 (Comprobación de Lista):** `if not pool:` o `if len(pool) == 0:` comprueba si la lista está vacía.\n* **Atajo 2 (Extracción O(1)):** Retorna `pool[0]` o `pool.pop(0)` si hay elementos.",
          "solution_explanation": "🔍 **Explicación Paso a Paso del Código:**\n1. `if not pool: return \"No disponible\"` -> Validamos si el pool no tiene sockets activos en memoria.\n2. `return pool[0]` -> Retornamos la primera conexión lista para usar en O(1).",
          "starter_code": "def simular_pool_conexion(pool: list) -> str:\n    # Tu código aquí\n    pass\n",
          "test_code": "\np = [\"conn1\", \"conn2\"]\nassert simular_pool_conexion(p) == \"conn1\"\nassert simular_pool_conexion([]) == \"No disponible\"\nprint(\"¡Simulación de Pool de conexión probada!\")\n"
        }
      },
      {
        "id": "b5_l2",
        "title": "5.2 APIs RESTful Asíncronas con FastAPI & JWT",
        "theory": "### FastAPI & Autenticación JWT\nFastAPI permite construir APIs asíncronas de alto rendimiento.\n* **JWT (JSON Web Tokens):** Token firmado digitalmente que contiene la identidad y roles del usuario, permitiendo autenticación *stateless* (sin guardar estados de sesión en servidor).",
        "code_bad": "# Endpoint síncrono bloqueante en servidor asíncrono\nfrom fastapi import FastAPI\nimport time\n\napp = FastAPI()\n\n@app.get(\"/lento\")\nasync def endpoint_lento():\n    time.sleep(2)\n    return {\"status\": \"ok\"}",
        "code_good": "# Endpoint asíncrono no bloqueante\nfrom fastapi import FastAPI\nimport asyncio\n\napp = FastAPI()\n\n@app.get(\"/rapido\")\nasync def endpoint_rapido():\n    await asyncio.sleep(2)\n    return {\"status\": \"ok\"}",
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
          "hints": "💡 **Atajos & Pistas de Resolución:**\n* **Atajo 1 (Handler Asíncrono):** Declara la función con `async def`.\n* **Atajo 2 (Retorno de Diccionario):** FastAPI convierte automáticamente los diccionarios retornados a formato JSON.",
          "solution_explanation": "🔍 **Explicación Paso a Paso del Código:**\n1. `async def obtener_perfil_usuario(user_id: int) -> dict:` -> Definición del handler asíncrono.\n2. `return {\"user_id\": user_id, \"rol\": \"admin\"}` -> Construimos el diccionario de respuesta serializado automáticamente a JSON.",
          "starter_code": "async def obtener_perfil_usuario(user_id: int) -> dict:\n    # Retorna el diccionario del usuario\n    pass\n",
          "test_code": "\nimport asyncio\nres = asyncio.run(obtener_perfil_usuario(42))\nassert res == {'user_id': 42, 'rol': 'admin'}\nprint(\"¡Endpoint asíncrono validado!\")\n"
        }
      },
      {
        "id": "b5_l3",
        "title": "5.3 Caching con Redis & Docker Compose",
        "theory": "### Caching con Redis\nRedis es un almacén de estructura de datos en memoria clave-valor de ultra alta velocidad.\n\n* **Patrón Cache-Aside:** La aplicación consulta primero en Redis. Si existe el valor (*cache hit*), lo retorne de inmediato. Si no existe (*cache miss*), lo lee de PostgreSQL, lo guarda en Redis con un tiempo de expiración (TTL) y lo devuelve.",
        "code_bad": "# Consultar base de datos relacional pesada en cada petición repetida\ndef obtener_catalogo_bad(db):\n    return db.query(\"SELECT * FROM productos_masivos\")",
        "code_good": "# Enfoque Optimizado: Cache-Aside con Redis\ndef obtener_catalogo_good(redis_client, db):\n    cached = redis_client.get(\"catalogo\")\n    if cached: return cached\n    data = db.query(\"SELECT * FROM productos_masivos\")\n    redis_client.setex(\"catalogo\", 300, data)\n    return data",
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
          "hints": "💡 **Atajos & Pistas de Resolución:**\n* **Atajo 1 (Operador `in` en Dicts):** Comprueba si la clave está en el diccionario con `if clave in cache:`.\n* **Atajo 2 (Asignación):** Si no está, asigna `cache[clave] = valor_default` y retorna el valor.",
          "solution_explanation": "🔍 **Explicación Paso a Paso del Código:**\n1. `if clave in cache: return cache[clave]` -> Verificamos si hay un Cache Hit y retornamos de inmediato.\n2. `cache[clave] = valor_default` -> En caso de Cache Miss, guardamos en la memoria del caché.\n3. `return valor_default` -> Retornamos el valor recién cacheado.",
          "starter_code": "def consultar_con_cache(cache: dict, clave: str, valor_default: str) -> str:\n    # Tu código aquí\n    pass\n",
          "test_code": "\nc = {}\nassert consultar_con_cache(c, \"k1\", \"v1\") == \"v1\"\nassert c[\"k1\"] == \"v1\"\nassert consultar_con_cache(c, \"k1\", \"v2\") == \"v1\"\nprint(\"¡Lógica de Cache-Aside verificada!\")\n"
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
        "theory": "### Profiling de Código en Producción\n* `cProfile`: Profiler determinista integrado. Rastrea cada llamada a función pero introduce sobrecarga.\n* `py-spy`: Sampling profiler escrito en Rust. Examina la memoria de CPython desde fuera sin detener el servidor ni degradar el rendimiento, generando diagramas de llama (*Flame Graphs*).",
        "code_bad": "# Intentar optimizar fragmentos de código por adivinanza sin medir con profilers\ndef algoritmo_adivinado():\n    pass",
        "code_good": "# Diagnóstico científico previo con py-spy\n# Terminal: py-spy record -o profile.svg --pid 1234",
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
          "hints": "💡 **Atajos & Pistas de Resolución:**\n* **Atajo 1 (Función Nativa):** Python incluye la función `max(numeros)` optimizada en C que resuelve esto en tiempo O(N).\n* **Atajo 2 (Alternativa Bucle):** Puedes usar un bucle guardando el elemento mayor visto hasta el momento.",
          "solution_explanation": "🔍 **Explicación Paso a Paso del Código:**\n1. `def encontrar_maximo(numeros: list) -> int:` -> Recibe la lista de números.\n2. `return max(numeros)` -> Invoca la función C nativa de Python que encuentra el máximo en un único paso lineal O(N).",
          "starter_code": "def encontrar_maximo(numeros: list) -> int:\n    # Retorna el máximo\n    pass\n",
          "test_code": "\nassert encontrar_maximo([3, 9, 1, 4]) == 9\nassert encontrar_maximo([-5, -1, -10]) == -1\nprint(\"¡Función de búsqueda de máximo probada!\")\n"
        }
      },
      {
        "id": "b6_l2",
        "title": "6.2 Aceleración JIT con Numba",
        "theory": "### Compilación Just-In-Time (JIT)\n**Numba** traduce funciones numéricas de Python directamente a código de máquina nativo en tiempo de ejecución utilizando la infraestructura de compilación LLVM.\n\n* `@jit(nopython=True)`: Fuerza a Numba a compilar el código sin intervención de la API de CPython, logrando velocidades comparables a C/C++.",
        "code_bad": "# Bucle numérico nativo en CPython (Lento para millones de iteraciones)\ndef suma_cuadrados_python(n: int):\n    total = 0\n    for i in range(n): total += i * i\n    return total",
        "code_good": "# Aceleración nativa con Numba JIT (Hasta 50x más rápido)\nfrom numba import jit\n\n@jit(nopython=True, fastmath=True)\ndef suma_cuadrados_numba(n: int):\n    total = 0\n    for i in range(n): total += i * i\n    return total",
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
          "hints": "💡 **Atajos & Pistas de Resolución:**\n* **Atajo 1 (Función Nativa):** Usa `sum(arr)` para sumar todos los enteros en C nativo.\n* **Atajo 2:** También puedes usar un acumulador en un bucle `total = 0; for x in arr: total += x`.",
          "solution_explanation": "🔍 **Explicación Paso a Paso del Código:**\n1. `def suma_vectorial(arr: list) -> int:` -> Definición de la función de acumulación.\n2. `return sum(arr)` -> Ejecuta la suma iterativa optimizada en C.",
          "starter_code": "def suma_vectorial(arr: list) -> int:\n    # Tu código aquí\n    pass\n",
          "test_code": "\nassert suma_vectorial([1, 2, 3, 4]) == 10\nassert suma_vectorial([10, 20]) == 30\nprint(\"¡Cálculo de suma vectorial validado!\")\n"
        }
      },
      {
        "id": "b6_l3",
        "title": "6.3 Testing de Carga (Locust) y CI/CD en GitHub Actions",
        "theory": "### Pruebas de Carga con Locust\nLocust permite definir escenarios de prueba de carga mediante código Python para simular miles de usuarios concurrentes en la API.\n\n### CI/CD en GitHub Actions\nLos flujos de trabajo en `.github/workflows/ci.yml` automatizan la validación de calidad en cada Pull Request:\n1. Linters sintácticos (`black`, `flake8`).\n2. Análisis estático de tipos (`mypy --strict`).\n3. Auditoría de seguridad (`Bandit`).\n4. Pruebas automáticas (`pytest`).",
        "code_bad": "# Desplegar a producción manualmente sin pruebas automáticas en CI/CD",
        "code_good": "# Configuración automatizada CI/CD en GitHub Actions\n# .github/workflows/ci.yml ejecuta 'pytest' y 'mypy' antes de autorizar el merge",
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
          "hints": "💡 **Atajos & Pistas de Resolución:**\n* **Atajo 1:** Compara directamente `status_code == 200` lo cual retorna `True` o `False` implícitamente.",
          "solution_explanation": "🔍 **Explicación Paso a Paso del Código:**\n1. `def verificar_estado_salud(status_code: int) -> bool:` -> Recibe el código de respuesta HTTP.\n2. `return status_code == 200` -> Evalúa la expresión de igualdad y devuelve el booleano resultante.",
          "starter_code": "def verificar_estado_salud(status_code: int) -> bool:\n    return status_code == 200\n",
          "test_code": "\nassert verificar_estado_salud(200) == True\nassert verificar_estado_salud(500) == False\nprint(\"¡Verificación de salud de CI/CD exitosa!\")\n"
        }
      }
    ]
  }
];

window.SQL_CHALLENGES_FALLBACK = [
  {
    "id": "sql_1",
    "title": "Misión 1: Bóveda de Usuarios",
    "level": 1,
    "difficulty": "Básico",
    "xp_reward": 50,
    "objective": "Selecciona el nombre, email y saldo de todos los usuarios registrados.",
    "description": "Aprende la cláusula fundamental SELECT para proyectar columnas específicas de una tabla sin traer datos innecesarios.",
    "starter_query": "SELECT nombre, email, saldo FROM usuarios;",
    "solution_query": "SELECT nombre, email, saldo FROM usuarios;",
    "natural_prompt": "selecciona el nombre, email y saldo de los usuarios",
    "hints": [
      "Usa la sintaxis: SELECT columna1, columna2 FROM nombre_tabla;",
      "Asegúrate de separar las columnas con comas.",
      "No uses asterisco '*' si te piden columnas específicas."
    ]
  },
  {
    "id": "sql_2",
    "title": "Misión 2: Filtro de Clientes VIP",
    "level": 2,
    "difficulty": "Básico-Intermedio",
    "xp_reward": 60,
    "objective": "Encuentra a los usuarios que tengan el rol 'cliente_vip' y un saldo mayor a 2500.",
    "description": "Domina la cláusula WHERE y el operador lógico AND para filtrar filas que cumplan múltiples condiciones.",
    "starter_query": "SELECT * FROM usuarios WHERE rol = 'cliente_vip' AND saldo > 2500;",
    "solution_query": "SELECT * FROM usuarios WHERE rol = 'cliente_vip' AND saldo > 2500;",
    "natural_prompt": "muestra los usuarios vip con saldo mayor a 2500",
    "hints": [
      "Las cadenas en SQL van entre comillas simples: 'cliente_vip'.",
      "Usa el operador '>' para comparar valores numéricos.",
      "El operador AND exige que ambas condiciones sean verdaderas."
    ]
  },
  {
    "id": "sql_3",
    "title": "Misión 3: Inventario Crítico & Ordenamiento",
    "level": 3,
    "difficulty": "Intermedio",
    "xp_reward": 70,
    "objective": "Obtén el nombre, stock y precio de los productos con stock menor o igual a 30, ordenados de menor a mayor stock.",
    "description": "Aprende a priorizar recursos en tu tienda online utilizando WHERE con operadores de comparación y ORDER BY ASC.",
    "starter_query": "SELECT nombre, stock, precio FROM productos WHERE stock <= 30 ORDER BY stock ASC;",
    "solution_query": "SELECT nombre, stock, precio FROM productos WHERE stock <= 30 ORDER BY stock ASC;",
    "natural_prompt": "productos con poco stock ordenados de menor a mayor",
    "hints": [
      "Menor o igual se escribe '<='.",
      "Para ordenar de menor a mayor se usa ORDER BY columna ASC (o simplemente omitir ASC, ya que es el valor por defecto)."
    ]
  },
  {
    "id": "sql_4",
    "title": "Misión 4: Métricas de Reservas de Hotel",
    "level": 4,
    "difficulty": "Intermedio+",
    "xp_reward": 80,
    "objective": "Calcula el total de reservas y el precio promedio por noche agrupado por tipo de habitación.",
    "description": "Utiliza funciones agregadas como COUNT(*) y AVG() combinadas con GROUP BY para generar reportes analíticos de negocio.",
    "starter_query": "SELECT habitacion_tipo, COUNT(*) AS total_reservas, AVG(precio_noche) AS precio_promedio FROM reservas_hotel GROUP BY habitacion_tipo;",
    "solution_query": "SELECT habitacion_tipo, COUNT(*) AS total_reservas, AVG(precio_noche) AS precio_promedio FROM reservas_hotel GROUP BY habitacion_tipo;",
    "natural_prompt": "cuenta cuántas reservas y precio promedio hay por tipo de habitación",
    "hints": [
      "Toda columna no agregada en el SELECT debe estar presente en la cláusula GROUP BY.",
      "Puedes usar alias descriptivos con AS (ej: COUNT(*) AS total_reservas)."
    ]
  },
  {
    "id": "sql_5",
    "title": "Misión 5: Unión Sagrada (INNER JOIN)",
    "level": 5,
    "difficulty": "Avanzado",
    "xp_reward": 100,
    "objective": "Relaciona la tabla de pedidos con usuarios para mostrar el nombre del cliente, el total del pedido y su estado.",
    "description": "Los datos relacionales viven en múltiples tablas. Domina INNER JOIN para conectar llaves foráneas con llaves primarias.",
    "starter_query": "SELECT u.nombre AS cliente, p.total, p.estado FROM pedidos p INNER JOIN usuarios u ON p.usuario_id = u.id;",
    "solution_query": "SELECT u.nombre AS cliente, p.total, p.estado FROM pedidos p INNER JOIN usuarios u ON p.usuario_id = u.id;",
    "natural_prompt": "muestra los pedidos con el nombre del cliente y el estado",
    "hints": [
      "Asigna alias cortos a las tablas para simplificar la lectura: 'pedidos p', 'usuarios u'.",
      "La condición de unión es 'ON p.usuario_id = u.id'."
    ]
  },
  {
    "id": "sql_6",
    "title": "Misión 6: Auditoría Salarial de Recursos Humanos",
    "level": 6,
    "difficulty": "Senior",
    "xp_reward": 120,
    "objective": "Obtén cada departamento, el número de empleados y el salario máximo pagado en dicho departamento.",
    "description": "Demuestra competencia empresarial analizando la estructura salarial de la empresa con GROUP BY y MAX().",
    "starter_query": "SELECT departamento, COUNT(*) AS total_empleados, MAX(salario) AS salario_maximo FROM empleados GROUP BY departamento ORDER BY salario_maximo DESC;",
    "solution_query": "SELECT departamento, COUNT(*) AS total_empleados, MAX(salario) AS salario_maximo FROM empleados GROUP BY departamento ORDER BY salario_maximo DESC;",
    "natural_prompt": "salario maximo y empleados por cada departamento",
    "hints": [
      "Agrupa por la columna 'departamento'.",
      "Usa MAX(salario) para hallar la remuneración más alta.",
      "Ordena con ORDER BY salario_maximo DESC para ver primero los departamentos mejor remunerados."
    ]
  }
];
