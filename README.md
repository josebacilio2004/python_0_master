# 🐍 Python & SQL Master: Game Edition (De Cero a Senior+)

Plataforma educativa interactiva y gamificada que transforma el aprendizaje exhaustivo de **Python** y **SQL** en una aventura de rol (estilo Duolingo / Questline), diseñada para llevarte desde **conocimiento nulo absoluto** hasta un nivel **Senior+ / Staff Engineer**.

Preparada para despliegue inmediato en **Render** conectando tu repositorio de **GitHub** y tu base de datos en la nube en **Supabase** (PostgreSQL).

---

## 🌟 Características Principales

### 1. 🗺️ El Camino del Desarrollador (Gamified Roadmap)
- **Sistema de Progresión:** Gana **XP (Experiencia)**, sube de nivel (desde *Recluta del Byte* hasta *Staff Engineer & Arquitecto*), mantén tu racha de días activos (🔥) y desbloquea insignias (🏆).
- **Mapa de Estaciones:** Nodos interactivos conectados por bloques que abarcan desde la sintaxis básica hasta la gestión de memoria en CPython, el GIL, la concurrencia, backend asíncrono y profiling.
- **Micro-Learning:** Clases breves de 3 minutos, comparativas de *Código Novato vs Código Senior*, y quizzes de validación inmediata (+20 XP).
- **Editor en Tiempo Real:** Ejecuta código Python con validación automática de tests unitarios (+50 XP), con botones desplegables de **💡 Atajos & Pistas** y **🔍 Explicación Paso a Paso del Código**.

### 2. 🗄️ Academia Interactiva de SQL & Supabase
- **Asistente Didáctico en Lenguaje Natural:** Escribe órdenes cotidianas en español (ej: *"selecciona el usuario de la tabla"*, *"muestra los productos con stock bajo"*, *"pedidos con nombre de cliente"*). El sistema:
  1. Traduce la intención a código SQL estándar optimizado.
  2. Ofrece un **desglose didáctico de cada cláusula** (`SELECT`, `FROM`, `WHERE`, `JOIN`, `GROUP BY`, `ORDER BY`).
  3. Ejecuta la consulta contra la base de datos real en tiempo real (PostgreSQL / Supabase).
  4. Renderiza una tabla interactiva con los datos, columnas, tiempo de ejecución en milisegundos y conteo de filas.
- **6 Misiones SQL Progresivas:** Desde proyecciones básicas hasta `INNER JOIN` y agregaciones estadísticas.
- **Seeder Incorporado:** Tablas listas y pobladas con datos de negocio (`usuarios`, `productos`, `reservas_hotel`, `pedidos`, `empleados`). Botón de 1 clic para sembrar o restablecer la base de datos.

### 3. 🧪 Laboratorio de Micro-Programas Didácticos
Herramientas interactivas basadas en los retos prácticos de `python_master.txt`:
1. 🧮 **Calculadora Aritmética & Evaluador AST:** Analiza expresiones matemáticas, jerarquía de operadores (PEMDAS) y tipos devueltos (`int` vs `float`).
2. 🏧 **Simulador de Cajero Automático (Reto 114):** Saldo interactivo, depósitos, retiros con validación de fondos y registro de movimientos, demostrando bucles interactivos `while`.
3. 🆔 **Generador de ID Único & Emails (Retos 40 y 53):** Normalización de texto, slicing de strings, métodos `.strip()`, `.lower()`, `.upper()` y números aleatorios con `random`.
4. 🏨 **Simulador de Reserva Hotelera (Retos 20 y 95):** Cotizaciones dinámicas según tipo de habitación, estancia y descuentos por número de noches.

---

## 🚀 Despliegue en Render con GitHub

La aplicación está completamente optimizada para desplegarse como un **Web Service gratuito o económico en Render**:

### Paso 1: Subir tus cambios a GitHub
```bash
git add .
git commit -m "feat: plataforma gamificada python master y curso sql con supabase y render"
git push origin main
```

### Paso 2: Crear el Web Service en Render
1. Ve a [dashboard.render.com](https://dashboard.render.com) y pulsa en **"New +" -> "Web Service"**.
2. Conecta tu repositorio de GitHub: `https://github.com/josebacilio2004/python_0_master.git`.
3. Render detectará automáticamente el archivo `render.yaml`, o puedes configurarlo manualmente:
   - **Environment:** `Python`
   - **Build Command:** `pip install -r backend/requirements.txt`
   - **Start Command:** `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`

### Paso 3: Conectar Supabase (PostgreSQL en la Nube)
1. En tu proyecto de [Supabase](https://supabase.com), ve a **Project Settings -> Database**.
2. Copia la cadena de conexión URI (Connection String).
3. En el panel de Render de tu servicio, ve a la pestaña **Environment** y añade:
   - **Key:** `DATABASE_URL` (o `SUPABASE_DB_URL`)
   - **Value:** `postgresql://postgres:[TU_PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres`
4. Al desplegarse, la aplicación conectará a Supabase y ejecutará el seeder automáticamente.
*(Nota: Si no configuras la URL de Supabase, la aplicación utilizará su base de datos local SQLite de forma transparente sin fallar).*

---

## 🛠️ Ejecución Local

1. **Instalar dependencias:**
   ```bash
   pip install -r backend/requirements.txt
   ```

2. **Ejecutar el seeder (opcional):**
   ```bash
   python backend/seeders/supabase_seeder.py
   ```

3. **Iniciar el servidor:**
   ```bash
   python backend/main.py
   ```

4. **Abrir en el navegador (PC o Móvil iPhone 7 en tu red Wi-Fi):**
   ```text
   http://localhost:8000
   http://192.168.1.5:8000
   ```

---

## 📱 Compatibilidad con Dispositivos Móviles (iPhone 7 / iOS 15)
- Interfaz táctil adaptativa con objetivos de toque de 44px+.
- Barra de navegación inferior nativa.
- Estilos Glassmorphism con aceleración por hardware.
