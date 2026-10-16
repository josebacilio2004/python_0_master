# Bloque 1: La Matriz Fundamental (Días 1-15)

## 📚 Lección 1.1: Sintaxis Básica, Variables y Tipos Primitivos

### Teoría Extendida
Python es un lenguaje interpretado, dinámico pero **fuertemente tipado**. Las variables son punteros en el **Stack** que apuntan a objetos alojados en el **Heap**.
* **Tipos Inmutables:** `int`, `float`, `str`, `bool`, `None`.

### 💡 Atajos & Pistas de Resolución
* **Atajo 1 (Operaciones Aritméticas):** Usa `/` para división flotante exacta `(celsius * 9/5) + 32`.
* **Atajo 2 (Construcción de Diccionarios):** Construye y retorna el diccionario en una sola línea `return {'fahrenheit': ..., 'kelvin': ...}`.

### 🔍 Explicación Paso a Paso del Código
```python
def convertir_temperatura(celsius: float) -> dict:
    f = (celsius * 9 / 5) + 32  # Convierte C a F
    k = celsius + 273.15       # Convierte C a K
    return {"fahrenheit": f, "kelvin": k} # Retorna diccionario O(1)
```

---

## 📚 Lección 1.2: Control de Flujo e Iteraciones

### Teoría Extendida
* `enumerate(iterable)`: Evita el antipatrón `range(len(lista))`.
* `range(start, stop, step)`: Generador de secuencias numéricas O(1) en memoria.

### 💡 Atajos & Pistas de Resolución
* **Atajo 1:** Los números `<= 1` NO son primos.
* **Atajo 2:** Prueba divisores desde `2` hasta la raíz cuadrada `int(numero**0.5) + 1` para reducir la complejidad a O(sqrt(N)).

### 🔍 Explicación Paso a Paso del Código
```python
def es_primo(numero: int) -> bool:
    if numero <= 1: 
        return False # Descarta <= 1
    for i in range(2, int(numero**0.5) + 1): # Optimización O(sqrt(N))
        if numero % i == 0: 
            return False # Encontró un divisor
    return True # Es primo
```

---

## 📚 Lección 1.3: Colecciones Nativas & Comprehensions

### 💡 Atajos & Pistas de Resolución
* **Atajo 1:** Sintaxis list comprehension: `[expresion for x in lista if condicion]`.

### 🔍 Explicación Paso a Paso del Código
```python
def filtrar_pares_cuadrados(numeros: list) -> list:
    return [x**2 for x in numeros if x % 2 == 0] # Filtra pares y eleva al cuadrado
```

---

## 📚 Lección 1.4: Memoria en CPython y GIL

### 💡 Atajos & Pistas de Resolución
* **Atajo 1:** Revisa la condición `i % 15 == 0` PRIMERO antes de 3 o 5 por separado.

### 🔍 Explicación Paso a Paso del Código
```python
def fizz_buzz(n: int) -> list:
    res = []
    for i in range(1, n + 1):
        if i % 15 == 0: res.append("FizzBuzz")
        elif i % 3 == 0: res.append("Fizz")
        elif i % 5 == 0: res.append("Buzz")
        else: res.append(str(i))
    return res
```
