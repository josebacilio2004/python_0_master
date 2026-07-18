# 🎓 Master en Python: De Cero a Experto (Senior+)

Este repositorio contiene una guía de aprendizaje exhaustiva, secuencial y práctica diseñada para llevar a un estudiante desde **conocimiento nulo absoluto** hasta un nivel de **Experto (Senior+ / Staff)** en Python. 

La ruta está estructurada como un plan de guerra académico-práctico de **100 días**, recomendando una dedicación diaria de **3 horas** de estudio enfocado y práctica deliberada.

---

## 🗺️ Estructura del Plan de Ruta

La ruta se divide en 6 bloques temáticos progresivos:

### 1. [Bloque 1: La Matriz Fundamental (Días 1-15)](./bloque_1_matriz_fundamental/README.md)
*   **Teoría:** Gestión de memoria (stack vs heap), mutabilidad de objetos, paso de parámetros por asignación, y el funcionamiento interno del GIL de CPython.
*   **Práctica:** Análisis de Big O en estructuras de datos nativas y un sistema de inventario interactivo en consola con control de excepciones específico.
*   **Entregable:** Scripts lógicos validados mediante doctests interactivos.

### 2. [Bloque 2: OOP Avanzada y Paradigma Funcional (Días 16-30)](./bloque_2_oop_y_funcional/README.md)
*   **Teoría:** El Modelo de Datos de Python (`__slots__`, descriptores, metaprogramación), composición vs herencia y herramientas funcionales (`itertools`, `functools`). Comparativa entre `dataclasses`, `attrs` y `Pydantic`.
*   **Práctica:** Construcción de un mini-ORM SQLite basado en descriptores y decoradores de reintento.
*   **Entregable:** Un paquete local empaquetado profesionalmente con soporte de pruebas unitarias.

### 3. [Bloque 3: Concurrencia y Paralelismo Real (Días 31-45)](./bloque_3_concurrencia/README.md)
*   **Teoría:** Hilos (`threading`), Procesos (`multiprocessing`) y E/S asíncrona cooperativa (`asyncio`). Patrones de diseño síncronos y asíncronos de productores y consumidores.
*   **Práctica:** Un web scraper masivo de 10,000 URLs con mediciones de rendimiento de hardware comparativas y graficadas en `matplotlib`.
*   **Entregable:** Scripts modulares con logging JSON estructurado y control de señales del sistema operativo (`SIGINT`/`SIGTERM`) para apagado controlado.

### 4. [Bloque 4: Arquitectura Avanzada y Tipado Estático (Días 46-60)](./bloque_4_arquitectura_y_tipado/README.md)
*   **Teoría:** Tipado estático con `mypy` / `pyright`, protocolos de tipado estructural, diseño guiado por dominio y patrones de diseño clásicos a la *Pythónica*.
*   **Práctica:** Refactorización del ORM con validación Pydantic v2 y un cargador dinámico de plugins.
*   **Entregable:** Repositorio con cobertura de código >90% en `pytest` y configurado con hooks automáticos de git (`pre-commit`).

### 5. [Bloque 5: Backend Empresarial y Bases de Datos (Días 61-80)](./bloque_5_backend_y_bd/README.md)
*   **Teoría:** PostgreSQL vs MongoDB, pools de conexiones óptimos, niveles de aislamiento transaccionales, Alembic, arquitecturas RESTful y GraphQL. Seguridad y OAuth2.
*   **Práctica:** Desarrollo de una API REST con FastAPI (endpoints asíncronos nativos, middlewares de seguridad, rate-limiting, paginaciones avanzadas).
*   **Entregable:** Entorno dockerizado completo con PostgreSQL y Redis, administrado por un `Makefile` de automatización.

### 6. [Bloque 6: Rendimiento, Testing de Carga y DevOps (Días 81-100)](./bloque_6_performance_y_devops/README.md)
*   **Teoría:** Profiling dinámico (`cProfile`, `py-spy`), compilación JIT (Cython, Numba, PyPy), estrategias distribuidas de caché (Redis), observabilidad (OpenTelemetry) y despliegue continuo seguro (Canary releases).
*   **Práctica:** Profiling y optimización extrema de la API eCommerce, y pruebas de carga con miles de usuarios concurrentes en `Locust`.
*   **Entregable:** Pipeline CI/CD en GitHub Actions y reporte de optimización con métricas (RPS, percentiles de latencia y uso de memoria).

---

## 🚀 Contribuciones a Proyectos Open Source

Para consolidar el perfil de Senior+ y saltar a nivel Staff, la contribución a software libre es indispensable. En el transcurso de esta ruta se recomienda participar en:
1.  **[FastAPI](https://github.com/fastapi/fastapi):** Aporta respondiendo dudas en discusiones, revisando traducciones de documentación o resolviendo bugs de inicio rápido (`good first issue`).
2.  **[SQLAlchemy](https://github.com/sqlalchemy/sqlalchemy):** Optimiza o añade anotaciones de tipos estáticos ausentes en módulos complejos de base de datos.
3.  **[mypy](https://github.com/python/mypy) / [Pydantic](https://github.com/pydantic/pydantic):** Profundiza en el parser interno escrito en Rust y C y extiende el soporte de validadores estáticos complejos.
