# 🚀 PYTHON & SQL MASTER (GAME EDITION) - DOSSIER ARQUITECTÓNICO COMPLETO

> **Documento Técnico de Referencia para Auditoría y Plan de Mejora en Gemini Argon 4**  
> **Versión del Sistema:** 2.4.0  
> **Repositorio:** [github.com/josebacilio2004/python_0_master](https://github.com/josebacilio2004/python_0_master)  
> **Producción Backend (Render):** `https://python-master-game-nigw.onrender.com`  
> **Producción Frontend (GitHub Pages):** `https://josebacilio2004.github.io/python_0_master/`  
> **Base de Datos Cloud:** Supabase PostgreSQL (AWS Oregon - Transaction Pooler PgBouncer)  

---

## 📑 ÍNDICE GENERAL
1. [Visión General y Objetivos del Proyecto](#1-visión-general-y-objetivos-del-proyecto)
2. [Topología de Despliegue y Arquitectura Global](#2-topología-de-despliegue-y-arquitectura-global)
3. [Estructura del Proyecto y Árbol de Componentes](#3-estructura-del-proyecto-y-árbol-de-componentes)
4. [Arquitectura de Base de Datos y Modelo de Datos](#4-arquitectura-de-base-de-datos-y-modelo-de-datos)
5. [Backend FastAPI y API Endpoints](#5-backend-fastapi-y-api-endpoints)
6. [Motor de Ejecución de Código Python (Sandbox)](#6-motor-de-ejecución-de-código-python-sandbox)
7. [Motor de Lenguaje Natural a SQL & Sandbox de Consultas](#7-motor-de-lenguaje-natural-a-sql--sandbox-de-consultas)
8. [Frontend Single Page Application (SPA) y UI/UX Móvil](#8-frontend-single-page-application-spa-y-uiux-móvil)
9. [Sistema de Rompecabezas de Código (Parsons Problems)](#9-sistema-de-rompecabezas-de-código-parsons-problems)
10. [Módulos Interactivos y Micro-Aplicaciones](#10-módulos-interactivos-y-micro-aplicaciones)
11. [Seguridad, Autenticación JWT y Resiliencia](#11-seguridad-autenticación-jwt-y-resiliencia)
12. [Guía de Auditoría y Solicitud de Mejoras para Argon 4](#12-guía-de-auditoría-y-solicitud-de-mejoras-para-argon-4)

---

## 1. VISIÓN GENERAL Y OBJETIVOS DEL PROYECTO

**Python & SQL Master: Game Edition** es una plataforma educativa interactiva orientada a convertir a un estudiante desde nivel principiante absoluto (Zero) hasta nivel Senior+ en Python, complementado con un simulador interactivo de bases de datos relacionales en SQL conectadas a PostgreSQL/Supabase.

### Principios Fundamentales de Diseño:
1. **Gamificación Profunda:** Todo el aprendizaje se modela como un RPG de desarrollo de software: XP acumulable, niveles jerárquicos (desde *Recluta del Byte* hasta *Arquitecto Maestro Cósmico*), misiones desbloqueables, rachas de días consecutivos y medallas.
2. **Pedagogía Activa y Progresión Cognitiva:**
   - **Rompecabezas de Bloques (Parsons Problems):** Para principiantes y usuarios en dispositivos móviles, los primeros retos permiten ordenar piezas de código antes de escribirlas desde cero, reduciendo la fricción sintáctica.
   - **Antipatrón vs Código Pythonico:** Cada lección compara visualmente la solución ineficiente/lenta contra el enfoque idiomático en CPython.
   - **Quizzes Formativos:** Preguntas de opción múltiple con retroalimentación inmediata sobre gestión de memoria, inmutabilidad y complejidad temporal.
   - **Atajos & Pistas:** Consejos estructurados para resolver retos algorítmicos.
3. **Compatibilidad Universal y Rendimiento Extremo:** El frontend está desarrollado en Vanilla JavaScript y CSS puro, garantizando compatibilidad con dispositivos con recursos limitados como el **iPhone 7 (Safari iOS 15)** y cargas instantáneas (<100ms) sin frameworks pesados ni dependencias de npm.
4. **Resiliencia Total (Zero Blank Screens):** Si el backend se encuentra suspendido (free tier de Render) o el usuario pierde conexión, el sistema conmuta automáticamente a un dataset estático offline (`curriculum_fallback.js`) y base SQLite local sin que la UI quede en blanco.

---

## 2. TOPOLOGÍA DE DESPLIEGUE Y ARQUITECTURA GLOBAL

El sistema implementa una arquitectura híbrida desacoplada:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        TOPOLOGÍA DISTRIBUIDA                           │
└────────────────────────────────────────────────────────────────────────┘

    [ Usuario Web / Mobile Safari iPhone 7 ]
                     │
         ┌───────────┴───────────┐
         ▼                       ▼
  [ GitHub Pages ]        [ Render Web Service ]
   /docs/ static           FastAPI Uvicorn (Port 8000)
   (app.js, style.css,     (Endpoints REST, Sandbox Python,
    index.html, fallback)   NL-to-SQL Engine, JWT Auth)
         │                       │
         └───────────┬───────────┘
                     │ HTTP / JSON API
                     ▼
         [ Supabase PostgreSQL Cloud ]
          AWS Oregon (us-west-2)
          PgBouncer Transaction Pooler (:6543)
          ├─ Tablas Negocio: usuarios, productos, reservas, pedidos, empleados
          └─ Tablas Sistema: user_accounts, user_profiles, user_progress, etc.
                     │
            (Fallback si DB Cloud offline)
                     ▼
             [ SQLite Local Fallback ]
              data/learning_game.db
```

### Componentes de Infraestructura:
* **Frontend Estático (GitHub Pages):** Alojado en el directorio `/docs/` de la rama `main`. No requiere compilación; consume directamente el backend mediante peticiones `fetch()` asíncronas con headers CORS configurados.
* **Backend Monolítico Ágil (Render):** Contenedor Python 3 ejecutando FastAPI + Uvicorn. Conexión de red optimizada para el Transaction Pooler de Supabase en el puerto `6543`.
* **Base de Datos Principal (Supabase):** PostgreSQL alojado en AWS `us-west-2`. Utiliza PgBouncer para soportar alta concurrencia de conexiones efímeras sin saturar el límite de sockets.
* **Base de Datos de Respaldo (SQLite):** En caso de falla de conectividad externa, SQLAlchemy conmuta transparentemente a `data/learning_game.db` con semillas completas precargadas.

---

## 3. ESTRUCTURA DEL PROYECTO Y ÁRBOL DE COMPONENTES

```
d:\jose\python_0_experto\
├── backend/
│   ├── auth.py                  # JWT encoding/decoding, Bcrypt hashing, Depends(get_current_user)
│   ├── curriculum_data.py       # 6 Bloques temáticos, 19 Lecciones, Puzzles, Quizzes, Tests
│   ├── database.py              # Engine SQLAlchemy, sessionmaker, fallback SQLite automático
│   ├── main.py                  # Instancia FastAPI, middlewares CORS, routers y static mounting
│   ├── routes/
│   │   ├── auth_route.py        # /api/auth/register, /login, /me
│   │   ├── curriculum_route.py  # /api/modules, /api/modules/{id}, /execute
│   │   ├── gamification_route.py# /api/profile, /api/progress, /api/achievements
│   │   ├── microapps_route.py   # /api/apps/atm, /calculator, /regex, /memory
│   │   └── sql_route.py         # /api/sql/challenges, /query, /natural, /schema
│   ├── seed_data.py             # Seeder empresarial (usuarios, reservas, productos, pedidos)
│   └── seeder_supabase.py       # Script CLI idempotente para inicializar Supabase
├── docs/                        # Build público para GitHub Pages (Copia sincronizada)
│   ├── app.js                   # Controlador SPA, routing tabs, eventos táctiles, puzzles
│   ├── curriculum_fallback.js   # Dataset estático JSON incrustado para modo offline
│   ├── index.html               # Markup semántico responsive y mobile navigation
│   └── style.css                # Sistema de diseño CSS moderno (Cyberpunk/Dark Slate)
├── web_app/
│   ├── static/                  # Fuentes de desarrollo del frontend
│   │   ├── app.js
│   │   ├── curriculum_fallback.js
│   │   ├── index.html
│   │   └── style.css
│   └── templates/
├── data/
│   └── learning_game.db         # Base de datos SQLite local
├── requirements.txt             # Dependencias: fastapi, uvicorn, sqlalchemy, psycopg2-binary, bcrypt, pyjwt
├── Procfile                     # Configuración de despliegue: web: uvicorn backend.main:app --host 0.0.0.0 --port $PORT
└── render.yaml                  # Infraestructura como código (IaC) para Render
```

---

## 4. ARQUITECTURA DE BASE DE DATOS Y MODELO DE DATOS

El sistema maneja dos dominios diferenciados dentro de la misma base relacional:

### Dominio A: Negocio y Simulación Empresarial (Retos SQL)
Tablas pobladas mediante `seed_data.py` para que el estudiante interactúe con datos realistas:
1. **`usuarios`**:
   - `id SERIAL PRIMARY KEY`, `nombre VARCHAR(100)`, `email VARCHAR(100) UNIQUE`, `edad INT`, `pais VARCHAR(50)`, `activo BOOLEAN`, `fecha_registro TIMESTAMP`.
2. **`productos`**:
   - `id SERIAL PRIMARY KEY`, `nombre VARCHAR(120)`, `categoria VARCHAR(50)`, `precio NUMERIC(10,2)`, `stock INT`, `proveedor VARCHAR(100)`.
3. **`reservas_hotel`**:
   - `id SERIAL PRIMARY KEY`, `huesped VARCHAR(120)`, `habitacion INT`, `tipo_habitacion VARCHAR(50)`, `noches INT`, `monto_total NUMERIC(10,2)`, `estado VARCHAR(30)`, `fecha_ingreso DATE`.
4. **`pedidos`**:
   - `id SERIAL PRIMARY KEY`, `usuario_id INT REFERENCES usuarios(id)`, `producto_id INT REFERENCES productos(id)`, `cantidad INT`, `total NUMERIC(10,2)`, `fecha TIMESTAMP`, `estado VARCHAR(30)`.
5. **`empleados`**:
   - `id SERIAL PRIMARY KEY`, `nombre VARCHAR(100)`, `departamento VARCHAR(50)`, `salario NUMERIC(10,2)`, `fecha_contratacion DATE`.

### Dominio B: Gamificación y Cuentas de Usuario
1. **`user_accounts`**:
   - `id SERIAL PRIMARY KEY`, `username VARCHAR(50) UNIQUE`, `email VARCHAR(100) UNIQUE`, `hashed_password VARCHAR(255)`, `created_at TIMESTAMP`.
2. **`user_profiles`**:
   - `id SERIAL PRIMARY KEY`, `user_id INT REFERENCES user_accounts(id)`, `full_name VARCHAR(100)`, `xp INT DEFAULT 0`, `level INT DEFAULT 1`, `rank_title VARCHAR(100)`, `streak_days INT DEFAULT 1`, `last_login TIMESTAMP`.
3. **`user_progress`**:
   - `id SERIAL PRIMARY KEY`, `user_id INT REFERENCES user_accounts(id)`, `block_id VARCHAR(50)`, `lesson_id VARCHAR(50)`, `completed BOOLEAN DEFAULT FALSE`, `score INT DEFAULT 0`, `xp_earned INT DEFAULT 0`, `completed_at TIMESTAMP`.
4. **`achievements`**:
   - `id VARCHAR(50) PRIMARY KEY`, `title VARCHAR(100)`, `description TEXT`, `icon VARCHAR(10)`, `xp_reward INT`.
5. **`sql_submissions`**:
   - `id SERIAL PRIMARY KEY`, `user_id INT`, `challenge_id VARCHAR(50)`, `query_executed TEXT`, `passed BOOLEAN`, `created_at TIMESTAMP`.

---

## 5. BACKEND FASTAPI Y API ENDPOINTS

El backend está construido con **FastAPI** asumiendo principios RESTful, inyección de dependencias (`Depends`) y tipado estricto con Pydantic.

### Matriz de Endpoints:

| Método | Endpoint | Descripción | Autenticación |
|---|---|---|---|
| `GET` | `/health` | Chequeo de salud del servicio y estado de la BD | Pública |
| `POST` | `/api/auth/register` | Registro de nuevo usuario (Bcrypt hash + JWT token) | Pública |
| `POST` | `/api/auth/login` | Autenticación de credenciales y generación de JWT | Pública |
| `GET` | `/api/auth/me` | Obtiene el perfil del usuario autenticado | Bearer JWT |
| `GET` | `/api/modules` | Lista de bloques del currículum con estadísticas | Pública |
| `GET` | `/api/modules/{block_id}` | Detalle de un bloque y sus lecciones | Pública |
| `GET` | `/api/modules/{block_id}/lesson/{lesson_id}` | Contenido completo de lección, teoría, quiz y reto | Pública |
| `POST` | `/api/execute` | Ejecuta código Python en sandbox y corre tests de aserción | Pública / Opcional JWT |
| `POST` | `/api/progress` | Registra progreso de lección y suma XP al usuario | Bearer JWT / Fallback |
| `GET` | `/api/profile` | Retorna estadísticas de juego, XP, medallas y nivel | Bearer JWT |
| `GET` | `/api/sql/challenges` | Lista de retos interactivos de SQL | Pública |
| `POST` | `/api/sql/query` | Ejecuta consulta SQL contra Supabase con validaciones de solo lectura | Pública / Sanitizada |
| `POST` | `/api/sql/natural` | Motor NL: Traduce lenguaje humano a SQL y retorna resultados | Pública / Sanitizada |
| `GET` | `/api/sql/schema` | Estructura de tablas y columnas disponibles para exploración | Pública |
| `POST` | `/api/apps/atm` | Simula operaciones bancarias seguras con validación de fondos | Pública |
| `POST` | `/api/apps/calculator` | Evaluador seguro de expresiones aritméticas con AST | Pública |
| `POST` | `/api/apps/regex` | Evaluador de expresiones regulares en tiempo real | Pública |

---

## 6. MOTOR DE EJECUCIÓN DE CÓDIGO PYTHON (SANDBOX)

El endpoint `/api/execute` permite al usuario enviar código que se valida dinámicamente frente a una batería de tests unitarios definida en cada lección.

### Flujo de Ejecución y Barreras de Seguridad:
1. **Pre-análisis AST:** Se parsea el código del usuario mediante `ast.parse()`. Se inspeccionan nodos de llamada e importaciones prohibidas (`__import__`, `os`, `sys`, `subprocess`, `shutil`, `open`, `eval`, `exec`).
2. **Composición del Script:** Se concatena el código del usuario junto al arnés de prueba de la lección (`test_code`):
   ```python
   # Código del alumno
   def convertir_temperatura(celsius: float) -> dict:
       f = (celsius * 9/5) + 32
       k = celsius + 273.15
       return {"fahrenheit": f, "kelvin": k}

   # Harnés de validación inyectado por el sistema
   res = convertir_temperatura(0.0)
   assert res['fahrenheit'] == 32.0, f"Error: {res}"
   assert res['kelvin'] == 273.15, f"Error: {res}"
   print("¡Test superado!")
   ```
3. **Ejecución en Subproceso Aislado:** Se ejecuta usando `subprocess.run([sys.executable, temp_file], capture_output=True, timeout=5)`.
4. **Manejo de Tiempos Límite (Timeout):** Cualquier bucle infinito (`while True`) es terminado forzosamente a los 5.0 segundos arrojando un error amigable `TimeoutError: Tiempo límite de ejecución superado (5s)`.
5. **Captura de Salida:** Se extraen `stdout` y `stderr` y se retornan en formato JSON con la bandera booleana `passed: true/false`.

---

## 7. MOTOR DE LENGUAJE NATURAL A SQL & SANDBOX DE CONSULTAS

Uno de los diferenciales didácticos del sistema es el módulo de **Lenguaje Natural a SQL**:

### Ejemplo de Interacción Didáctica:
* **Entrada del Alumno:** `"selecciona los usuarios de México mayores de 20 años"`
* **Traducción Sintetizada:**
  ```sql
  SELECT id, nombre, email, edad, pais 
  FROM usuarios 
  WHERE pais = 'México' AND edad > 20 
  LIMIT 20;
  ```
* **Respuesta en Tiempo Real:** La plataforma no solo muestra el código SQL generado, sino que ejecuta la consulta en vivo en la base de datos de Supabase y renderiza una tabla interactiva con las filas obtenidas.

### Barreras de Seguridad en Consultas SQL:
1. **Inspección de AST/Palabras Clave Prohibidas:** Toda consulta pasa por un validador que rechaza inmediatamente sentencias destructivas: `DROP`, `TRUNCATE`, `DELETE`, `ALTER`, `GRANT`, `REVOKE`, `INSERT`, `UPDATE`.
2. **Modo Transaccional Solo-Lectura:** Las consultas se ejecutan bajo un bloque de solo lectura con rollback automático:
   ```python
   connection.execute(text("SET TRANSACTION READ ONLY;"))
   result = connection.execute(text(sanitized_query))
   ```
3. **Techo de Paginación Forzado (Limit Clamping):** Para evitar desbordamientos de memoria o ataques de denegación de servicio (DoS) por `SELECT * FROM tabla_enorme`, se anexa o restringe un `LIMIT 100`.

---

## 8. FRONTEND SINGLE PAGE APPLICATION (SPA) Y UI/UX MÓVIL

El frontend reside en `/web_app/static/` (y `/docs/` para GitHub Pages).

### Principios de UI/UX:
* **Dark Cyberpunk Theme:** Paleta de alto contraste inspirada en editores profesionales (Slate Dark `#0a0e17`, Cyan Neón `#38bdf8`, Verde Esmeralda `#10b981`, Dorado XP `#f59e0b`).
* **Mobile-First Touch Ergonomics (iPhone 7 / iOS 15 Safari):**
  - Barra de navegación fija inferior (`.mobile-nav`) con iconos de 48x48px para pulgares.
  - Tipografía responsive calculada con `clamp()`.
  - Sin dependencias de JavaScript pesado: no requiere Webpack, Vite, Node runtime, ni librerías de 2MB. Carga completa en <200ms en redes 3G/4G.
* **Secciones Principales de la SPA:**
  1. `camino`: El mapa de ruta estilo Duolingo/RPG con 6 bloques y 19 estaciones.
  2. `sql`: Playground interactivo con 6 misiones empresariales, vista de esquemas y tabla de resultados dinámica.
  3. `apps`: 4 micro-aplicaciones funcionales para practicar lógica práctica.
  4. `clases`: Sesiones breves de lectura teórica concentrada.
  5. `logros`: Pantalla de trofeos y progreso de nivel.
  6. `settings`: Conexión de API dinámica y diagnóstico de conectividad con Render.

---

## 9. SISTEMA DE ROMPECABEZAS DE CÓDIGO (PARSONS PROBLEMS)

Para facilitar la curva de aprendizaje inicial (Bloque 1), las lecciones cuentan con la modalidad **Rompecabezas de Bloques de Código**:

```
┌─────────────────────────────────────────────────────────────┐
│              MODAL DE RETO: ESTACIÓN 1.1                     │
│  [🧩 Armar Rompecabezas (Bloques)]  [💻 Escribir Código]     │
├─────────────────────────────────────────────────────────────┤
│  📦 PIEZAS DISPONIBLES (Toca para agregar):                 │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ [ return {'fahrenheit': f, 'kelvin': k} ]             │  │
│  │ [ f = (celsius * 9 / 5) + 32 ]                        │  │
│  │ [ return [f, k] ]  <-- Distractor trampas             │  │
│  │ [ def convertir_temperatura(celsius: float) -> dict: ]│  │
│  │ [ k = celsius + 273.15 ]                              │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  🧩 FUNCIÓN ENSAMBLADA (Toca para quitar):                   │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ 1. def convertir_temperatura(celsius: float) -> dict: │  │
│  │ 2.     f = (celsius * 9 / 5) + 32                     │  │
│  │ 3.     k = celsius + 273.15                           │  │
│  │ 4.     return {'fahrenheit': f, 'kelvin': k}          │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  [⚡ Probar Solución del Rompecabezas]  [Editar como Texto →]│
└─────────────────────────────────────────────────────────────┘
```

### Características Técnicas del Puzzle:
1. **Piezas Mezcladas Aleatoriamente:** Las líneas correctas se desordenan en el cliente (`pool`) y se mezclan con distractores erróneos (`puzzle_distractors`).
2. **Interacción One-Touch:** En pantallas táctiles de teléfonos móviles, el usuario toca una pieza y se ensambla secuencialmente en el área de trabajo con su indentación nativa preservada.
3. **Prueba Instantánea:** Al presionar *Probar Solución*, el código ensamblado se compila, se inyecta en el evaluador y se ejecutan los tests de aserción en el backend, otorgando XP.
4. **Transición Fluida a Código Real:** El botón *Editar como Texto* transfiere el bloque ensamblado al `textarea` del editor tradicional para que el estudiante aprenda a escribirlo manualmente.

---

## 10. MÓDULOS INTERACTIVOS Y MICRO-APLICACIONES

Para conectar la teoría con la práctica aplicada, el sistema incluye 4 micro-aplicaciones funcionales:
1. **Simulador de Cajero Automático (ATM):** Demuestra estructuras condicionales, validación de saldos y manejo de excepciones financieras.
2. **Calculadora con Notación Polaca Inversa / Expresiones:** Demuestra la estructura de datos Pila (Stack) y evaluación segura de operadores matemáticos.
3. **Probador y Validador de Expresiones Regulares (Regex):** Motor de pruebas de patrones en tiempo real (emails, contraseñas, URLs).
4. **Visualizador Conceptual de Stack vs Heap:** Demuestra cómo CPython gestiona punteros, objetos inmutables en memoria y el contador de referencias (`ob_refcnt`).

---

## 11. SEGURIDAD, AUTENTICACIÓN JWT Y RESILIENCIA

### Especificación de Seguridad:
* **Hashing de Contraseñas:** `bcrypt.hashpw(password, bcrypt.gensalt(12))` con factor de costo 12.
* **Tokens de Acceso:** JSON Web Tokens (JWT) firmados con algoritmo `HS256`, con tiempo de expiración configurable (por defecto 7 días).
* **Protección contra Inyecciones:**
  - En Python: AST pre-scan + ejecución fuera del proceso principal.
  - En SQL: Bloqueo de sentencias DDL/DML de modificación, aislamiento de transacciones `READ ONLY` y límites de filas forzados.

### Resiliencia Offline (Fallback Inteligente):
* Cuando un usuario accede desde GitHub Pages (`https://josebacilio2004.github.io/python_0_master/`), `app.js` detecta el origen y apunta de manera predeterminada al backend en Render (`https://python-master-game-nigw.onrender.com`).
* Si el backend se encuentra dormido (arrancando en frío), el frontend no se rompe: carga de inmediato los 6 bloques y 19 lecciones desde `window.CURRICULUM_FALLBACK`. Una vez el backend responde al chequeo `/health`, el punto de estado cambia a verde neón y habilita la ejecución en vivo.

---

## 12. GUÍA DE AUDITORÍA Y SOLICITUD DE MEJORAS PARA ARGON 4

> **INSTRUCCIONES PARA COPIAR Y PEGAR EN GEMINI (ARGON 4):**  
> *"Actúa como un Staff Software Engineer y Lead Architect especialista en Python Full-Stack, Educación Tecnológica y UI/UX Móvil. A continuación te presento el dossier arquitectónico completo de nuestra plataforma educativa **Python & SQL Master (Game Edition)**. Analiza minuciosamente el sistema y entrégame un plan estratégico y detallado de mejoras dividido en los siguientes 5 pilares:"*

### Puntos Específicos que Argon 4 debe Evaluar:

#### Pilar 1: Modernización y Rendimiento Frontend / UX Móvil
1. **Componentes Visuales & Micro-interacciones:** Sugerencias para elevar el diseño Cyberpunk/Dark Slate a nivel comercial (efectos de partículas para XP, micro-animaciones CSS con `will-change`, feedback háptico en iOS si aplica, transiciones de pantalla con View Transitions API).
2. **Editor de Código Ligero:** ¿Conviene integrar un editor embebido ultraligero (como CodeMirror 6 modular o PrismJS con resaltado en vivo) sin comprometer el rendimiento en iPhone 7?
3. **Evolución del Modo Rompecabezas (Parsons):** ¿Cómo mejorar la interfaz de ensamblado de bloques (drag-and-drop accesible mediante HTML5 Drag & Drop o touch events, detección de indentación dinámica por niveles de sangría)?
4. **Capacidades PWA:** Plan para convertir la SPA en una Progressive Web App instalable con Service Workers y caché offline completa de retos y ejecuciones simuladas en Pyodide/WebAssembly.

#### Pilar 2: Arquitectura de Ejecución Backend & Aislamiento Seguro
1. **Ejecución de Código Python a Escala:** Actualmente usamos `subprocess.run` con timeout y filtro AST. ¿Cómo migrar esto de forma viable a contenedores Docker efímeros (gVisor / Firecracker / WebAssembly WASI con Wasmtime) para aislar el 100% de la ejecución en entornos de producción con alta concurrencia?
2. **Gestión de Colas y Concurrencia:** Diseño de una arquitectura con Celery / Redis o FastAPI Background Tasks con WebSocket para streaming de salida en tiempo real (`stdout` por caracteres).
3. **Métricas y Rate Limiting:** Implementación de limitación de tasa por IP/Token (SlowAPI) para evitar saturación de CPU en el free tier de Render.

#### Pilar 3: Base de Datos, Supabase y Motor SQL
1. **Optimización del Transaction Pooler:** Mejores prácticas para gestionar sesiones SQLAlchemy con PgBouncer en el puerto 6543 de Supabase sin perder funcionalidades ni provocar bloqueos de transacción.
2. **Ampliación del Motor Natural Language a SQL:** ¿Cómo incorporar embeddings vectoriales o un LLM ligero (Gemini Flash API) como copiloto de SQL para evaluar si la consulta del alumno es semánticamente correcta incluso si escribe sintaxis diferente a la esperada?
3. **Seguridad Avanzada en SQL Dinámico:** Sugerencias para robustecer la sanitización de consultas de solo lectura en PostgreSQL (ej. usuarios sin privilegios `NOBYPASSRLS`, esquemas separados en memoria o bases de datos SQLite efímeras en RAM por sesión de usuario).

#### Pilar 4: Motor de Gamificación y Retención Pedagógica
1. **Sistema de Ligas y Duelos:** Mecánica de duelos en tiempo real (1 vs 1) de resolución de código o consultas SQL rápidas.
2. **Árbol de Habilidades Tecnológicas:** Transformar el camino lineal en un árbol ramificado de especialidades (Backend Web con FastAPI, Data Science con Pandas, DevOps con scripts de automatización).
3. **Métricas de Rendimiento del Código del Alumno:** Medición de tiempo de ejecución del código del alumno y consumo de memoria (Big-O Analyzer) para otorgar medallas de optimización algorítmica.

#### Pilar 5: DevOps, Monitoreo y Escalabilidad
1. **Pipeline de Integración Continua (CI/CD):** Workflow de GitHub Actions que ejecute tests unitarios del backend, valide la sintaxis de las 19 lecciones y sincronice automáticamente `/web_app/static/` con `/docs/` en cada push a `main`.
2. **Monitoreo de Disponibilidad (Keep-Alive):** Estrategias para mitigar el tiempo de inactividad por cold-start en el free tier de Render (ej. cron jobs ligeros de ping a `/health` o edge functions).
