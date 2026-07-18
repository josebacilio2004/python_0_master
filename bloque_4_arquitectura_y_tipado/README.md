# Bloque 4: Arquitectura Avanzada y Tipado Estático (Días 46-60)

## 🧠 Teoría Profunda

### Tipado Estático y Análisis Estático en un Lenguaje Dinámico
Python no valida tipos en tiempo de ejecución de forma nativa, pero herramientas de tipado como `mypy` y `pyright` analizan el código estáticamente para evitar bugs en producción.
*   `typing.Protocol`: Define clases mediante tipado estructural (interfaces implícitas). Si una clase implementa los métodos requeridos por el protocolo, se acepta como un tipo válido sin necesidad de herencia explícita.
*   `Generics` (`TypeVar`): Permiten abstraer lógica reutilizable manteniendo el tipado estricto a través de múltiples clases o funciones de dominio.

### Patrones de Diseño al Estilo Python
*   **Factory Pattern:** Python permite usar referencias directas de clases y pasarlas como argumentos o almacenarlas en diccionarios, haciendo innecesaria la jerarquía rígida de fábricas típica de Java.
*   **Repository Pattern:** Aísla la persistencia de datos (SQL, MongoDB) de la lógica de dominio de negocio pura, facilitando mockear la infraestructura en las pruebas unitarias.
*   **Singleton:** Implementado tradicionalmente mediante `__new__` o de forma simple a nivel de módulo (aprovechando que Python solo importa los módulos una vez e indexa su referencia en `sys.modules`).

### Validación de Esquemas: Pydantic v2
*   Pydantic v2 valida los tipos de datos entrantes a nivel de CPU usando un motor optimizado en Rust. Es el estándar de oro para el diseño de DTOs (Data Transfer Objects) en APIs empresariales.

---

## 🛠️ Contraste de Código

### ❌ Código Ineficiente (Acoplamiento de infraestructura y sin tipado)
```python
# Lógica de negocio directamente acoplada a SQLite y sin contratos de tipado
class NegocioServicio:
    def __init__(self, db_conexion):
        self.db = db_conexion

    def registrar_compra(self, usuario_id, item_precio):
        # Si se cambia a Postgres o API externa, se debe reescribir este método
        cursor = self.db.cursor()
        cursor.execute(
            "INSERT INTO compras (usuario, precio) VALUES (?, ?)", 
            (usuario_id, item_precio)
        )
        self.db.commit()
```

### Enfoque Optimizado (Uso de Protocol y Generics para desacoplamiento)
```python
from typing import Protocol, TypeVar, Generic

T = TypeVar('T')

class PersistenciaRepository(Protocol[T]):
    """Interfaz implícita desacoplada del motor de base de datos"""
    def guardar(self, entidad: T) -> None:
        ...

class Compra:
    def __init__(self, usuario_id: str, precio: float):
        self.usuario_id = usuario_id
        self.precio = precio

# Caso de uso cerrado para pruebas unitarias sin dependencias externas
class ServicioNegocioOptimizado(Generic[T]):
    def __init__(self, repo: PersistenciaRepository[T]):
        self.repo = repo

    def registrar_compra(self, compra: T) -> None:
        # Se pueden inyectar mocks sin necesidad de simular sockets o conexiones SQLite
        self.repo.guardar(compra)
```

---

## 📋 Práctica Obligatoria y Ejercicios
1.  **Refactorización:** Integra validación estructurada con Pydantic v2 en el mini-ORM del Bloque 2.
2.  **Arquitectura de Plugins:** Desarrolla un sistema modular que cargue extensiones externas en tiempo de ejecución usando el cargador nativo `importlib`.

---

## 📦 Entregable del Bloque
*   Código con cobertura superior al 90% usando `pytest` (pruebas parametrizadas, fixtures de recursos, mocking de base de datos).
*   Configuración estricta de un pipeline de análisis estático local usando **pre-commit** (`black`, `isort`, `flake8` y `mypy --strict`).

---

## 📚 Recursos Recomendados
*   **Libro:** *Architecture Patterns with Python* (Harry Percival & Bob Gregory).
*   **Libro:** *Python Clean Code* (Mariano Anaya).
*   **Charla PyCon:** "Type Hints in Python" por Bernát Gábor.

---

## ✅ Validación de Conocimientos
* [ ] Argumentar la diferencia de arquitectura entre `mypy` (verificación de tipos de desarrollo) y `Pydantic` (validación en tiempo de ejecución).
* [ ] Implementar decoradores tipados usando `typing.ParamSpec` y `typing.TypeVar`.
* [ ] Configurar un pre-commit hook personalizado para validar archivos JSON sintácticamente.

---

## ⚠️ Advertencias de Seniors
> [!NOTE]
> **Error de Senior:** Escribir pruebas unitarias que dependan de bases de datos reales o servicios externos activos. Las pruebas unitarias deben ser deterministas y ejecutarse de forma aislada en memoria mediante mocks rápidos.
