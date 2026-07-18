# Bloque 2: OOP Avanzada y Paradigma Funcional (Días 16-30)

## 🧠 Teoría Profunda

### El Modelo de Datos de Python e Intercepción Metaprogramable
Python no utiliza llamadas estáticas rígidas; cada operación sobre un objeto se traduce en la ejecución de un método mágico (*dunder method*).
*   `__slots__`: Por defecto, cada instancia tiene un diccionario dynamic `__dict__` que consume memoria considerable. Definir `__slots__ = ('name', 'id')` le indica a Python que reserve espacio fijo en el heap para dichos atributos utilizando arrays C estáticos, optimizando el uso de memoria en millones de objetos activos.
*   `__getattr__` vs `__getattribute__`: `__getattribute__` intercepta incondicionalmente el acceso a **cualquier** atributo del objeto. `__getattr__` solo se invoca cuando el atributo solicitado no existe en el diccionario del objeto (es ideal para implementar cargadores perezosos o proxies).

### Protocolos: Duck Typing y Tipado Estructural
En Python, un objeto se define por su comportamiento (métodos mágicos), no por su árbol de herencia:
*   **Protocolo de Iteración:** Requiere implementar `__iter__()` (que retorna un objeto iterador) e `__next__()` (que retorna el siguiente elemento o lanza `StopIteration`).
*   **Protocolo Administrador de Contexto:** Requiere `__enter__()` e `__exit__()`. Permite automatizar la gestión de liberación de recursos en bloques `with`.
*   **Protocolo Descriptor:** Clases que implementan `__get__()`, `__set__()` o `__delete__()`. Permiten controlar de forma granular el acceso y validación de atributos de otra clase.

### Comparativa: Estructuras de Datos de Datos Modernas
*   `dataclasses`: Biblioteca estándar. Genera constructores, comparadores y representaciones visuales automáticamente.
*   `attrs`: Librería externa avanzada que añade soporte para validaciones estrictas y atributos privados.
*   `Pydantic`: Biblioteca diseñada para el análisis sintáctico (parsing) y validación estricta de tipos de datos en tiempo de ejecución.

### Programación Funcional
*   `functools.partial`: Retorna un invocable con argumentos preestablecidos.
*   `itertools` y `functools`: Módulos altamente optimizados en C para el procesamiento rápido de flujos de datos sin sobrecargar la memoria.

---

## 🛠️ Contraste de Código

### ❌ Código Ineficiente (Validación repetitiva con métodos getter/setter tradicionales)
```python
class UsuarioTradicional:
    def __init__(self, email: str, edad: int):
        self.set_email(email)
        self.set_edad(edad)

    def set_email(self, email: str):
        if "@" not in email:
            raise ValueError("Email inválido")
        self._email = email

    def set_edad(self, edad: int):
        if edad < 0:
            raise ValueError("La edad no puede ser negativa")
        self._edad = edad
```

### Enfoque Optimizado (Descriptores reutilizables)
```python
from typing import Any

class ValidarTipo:
    def __init__(self, tipo_esperado: type):
        self.tipo_esperado = tipo_esperado

    def __set_name__(self, owner: Any, name: str):
        self.private_name = f"_{name}"

    def __get__(self, instance: Any, owner: Any) -> Any:
        if instance is None:
            return self
        return getattr(instance, self.private_name)

    def __set__(self, instance: Any, value: Any):
        if not isinstance(value, self.tipo_esperado):
            raise TypeError(f"Se esperaba {self.tipo_esperado}")
        setattr(instance, self.private_name, value)

class UsuarioPythonico:
    email = ValidarTipo(str)
    edad = ValidarTipo(int)

    def __init__(self, email: str, edad: int):
        self.email = email
        self.edad = edad
```

---

## 📋 Práctica Obligatoria y Ejercicios
1.  **Mini-ORM SQLite:**
    *   Crea una base de datos SQLite y mapea objetos de dominio usando descriptores.
    *   Usa administradores de contexto para controlar la conexión a base de datos y transacciones automáticas.
2.  **Decoradores de Utilidad:**
    *   Implementa `@cronometrar` y `@retry(intentos=3, delay=1)` para reintentar la llamada ante fallos transitorios de red.

---

## 📦 Entregable del Bloque
Estructurar el ORM SQLite como un paquete instalable localmente:
*   Debe contener un archivo `pyproject.toml` configurando la distribución con `setuptools` o `poetry`.
*   Un archivo de pruebas unitarias usando `unittest` que verifique la inserción y consulta del ORM.

---

## 📚 Recursos Recomendados
*   **Libro:** *Fluent Python* (Luciano Ramalho) - Capítulos 8 (Type Hints) y 18 (with and contextlib).
*   **Libro:** *Effective Python* (Brett Slatkin) - Capítulos sobre OOP y Metaprogramación.
*   **Charla PyCon:** "Python Descriptors Demystified" por Simeon Franklin.

---

## ✅ Validación de Conocimientos
* [ ] Describir con exactitud el algoritmo de linealización C3 que resuelve el MRO (Method Resolution Order).
* [ ] Implementar un descriptor de solo lectura utilizando propiedades dinámicas.
* [ ] Explicar la diferencia entre `__new__` y `__init__` en la creación de un objeto.

---

## ⚠️ Advertencias de Seniors
> [!IMPORTANT]
> **Error de Senior:** Abusar de la metaprogramación con metaclasas cuando el problema se puede resolver con decoradores de clases o descriptores sencillos. La metaprogramación añade una capa de complejidad cognitiva que dificulta el mantenimiento a largo plazo.
