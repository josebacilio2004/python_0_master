# Bloque 5: Backend Empresarial y Bases de Datos (Días 61-80)

## 🧠 Teoría Profunda

### PostgreSQL vs MongoDB en Entornos de Alta Demanda
*   **PostgreSQL:** Motor relacional robusto. Destaca por soporte ACID completo, índices B-Tree/GIN, y optimizaciones complejas de joins.
*   **MongoDB:** Motor documental NoSQL. Ideal para almacenamiento de catálogos y estructuras polimórficas donde la velocidad de escritura prima sobre la consistencia transaccional compleja.

### Pools de Conexiones y Niveles de Aislamiento
*   **Pool de Conexiones:** Mantiene un conjunto de sockets de base de datos abiertos para evitar el costo TCP/TLS de reconexión por cada petición HTTP.
*   **Niveles de Aislamiento de Transacciones:**
    *   *Read Uncommitted:* Permite lecturas sucias (dirty reads).
    *   *Read Committed:* Por defecto en PostgreSQL. Evita que transacciones vean datos sin confirmar.
    *   *Repeatable Read:* Evita que modificaciones externas alteren lecturas dentro de la misma transacción.
    *   *Serializable:* Aislamiento total. Las transacciones concurrentes se comportan como si se ejecutaran secuencialmente.

### Migraciones con Alembic
*   El control de versiones en bases de datos relacionales se gestiona mediante scripts de migración ordenados secuencialmente. **Alembic** automatiza la generación de scripts analizando los cambios en los modelos de SQLAlchemy.

### APIs Modernas y Seguridad
*   **REST (FastAPI / Django Ninja):** APIs estructuradas en torno a endpoints HTTP semánticos.
*   **GraphQL (Strawberry):** Endpoint único que permite al cliente definir la estructura exacta del JSON devuelto.
*   **Seguridad:** Uso de tokens JWT cifrados asimétricamente, control de acceso basado en roles (RBAC) y hashing de contraseñas con **bcrypt**.

---

## 🛠️ Contraste de Código

### ❌ Código Ineficiente (Consulta N+1 en bases de datos relacionales)
```python
from sqlalchemy.orm import Session
from sqlalchemy import select

# Problema N+1: Ejecuta una consulta para traer posts y luego una consulta adicional por cada autor
def obtener_posts_lento(db: Session):
    # Trae todos los posts (1 consulta)
    posts = db.execute(select(Post)).scalars().all()
    for post in posts:
        # Llama a base de datos de nuevo por cada post para traer su relación (N consultas)
        print(post.autor.nombre)
    return posts
```

### Enfoque Optimizado (Carga inmediata de relaciones - Eager Loading)
```python
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import select

# Eager Loading: Trae posts y autores en un único JOIN optimizado
def obtener_posts_rapido(db: Session):
    stmt = select(Post).options(joinedload(Post.autor))
    posts = db.execute(stmt).scalars().all()
    for post in posts:
        # Autor ya está cargado en memoria, no hay llamadas adicionales a base de datos
        print(post.autor.nombre)
    return posts
```

---

## 📋 Práctica Obligatoria y Ejercicios
1.  **API REST de eCommerce en FastAPI:**
    *   Implementa endpoints asíncronos nativos para catálogos y órdenes de compra.
    *   Crea un middleware de seguridad para validar tokens JWT.
    *   Integra rate-limiting dinámico usando **Redis** como almacén en caché.

---

## 📦 Entregable del Bloque
Un repositorio dockerizado listo para producción:
*   Un archivo `docker-compose.yml` que orqueste la API web de FastAPI, PostgreSQL y un cluster Redis.
*   Un script de migración y seed masivo que inserte de forma limpia 100,000 registros para pruebas iniciales.
*   Un `Makefile` con alias para automatizar el ciclo de desarrollo (`make build`, `make migrate`, `make run`).

---

## 📚 Recursos Recomendados
*   **Libro:** *Designing Data-Intensive Applications* (Martin Kleppmann) - Capítulos 2 y 3.
*   **Documentación:** FastAPI (Sección de Seguridad y Autenticación).
*   **Charla PyCon:** "SQLAlchemy 2.0: Pythonic SQL at Scale" por Mike Bayer.

---

## ✅ Validación de Conocimientos
* [ ] Explicar teóricamente el problema de bloqueo transaccional (Deadlock) y cómo prevenirlo a nivel de aplicación.
* [ ] Implementar un flujo OAuth2 Authorization Code con verificación de firma y expiración de tokens JWT.
* [ ] Configurar Alembic para rastrear de forma automática modificaciones complejas en tipos de datos Enum en PostgreSQL.

---

## ⚠️ Advertencias de Seniors
> [!CAUTION]
> **Error de Senior:** Exponer claves secretas y contraseñas de producción directamente en el código fuente o en archivos de configuración subidos a Git. Utiliza siempre variables de entorno cargadas dinámicamente mediante `pydantic-settings` o bibliotecas similares.
