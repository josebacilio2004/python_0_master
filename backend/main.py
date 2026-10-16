import os
import sys

# Asegurar que el directorio backend está en sys.path
sys.path.insert(0, os.path.dirname(__file__))

# Evitar UnicodeEncodeError en Windows cp1252
if sys.stdout and hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from database import engine, Base
import models
from seeders.supabase_seeder import seed_database

# Rutas API
from routes.modules_route import router as modules_router
from routes.progress_route import router as progress_router
from routes.execute_route import router as execute_router
from routes.sql_route import router as sql_router
from routes.microapps_route import router as microapps_router
from routes.auth_route import router as auth_router

# Inicializar tablas de base de datos
try:
    Base.metadata.create_all(bind=engine)
    print("[DB] Tablas de sistema inicializadas correctamente.")
    # Siembra inicial si es necesario
    seed_database()
except Exception as e:
    print(f"[DB] Advertencia al inicializar tablas: {e}")

app = FastAPI(
    title="Python Master Game & SQL Academy",
    description="Plataforma interactiva y gamificada de aprendizaje en Python y SQL (Render + Supabase)",
    version="2.0.0"
)

# Configuración CORS permisiva para acceso local móvil (iPhone 7) y Cloud (Render)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registro de Enrutadores
app.include_router(modules_router)
app.include_router(progress_router)
app.include_router(execute_router)
app.include_router(sql_router)
app.include_router(microapps_router)
app.include_router(auth_router)

# Servir archivos estáticos del Frontend
STATIC_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "web_app", "static")

if os.path.exists(STATIC_DIR):
    app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

@app.get("/")
def read_root():
    index_path = os.path.join(STATIC_DIR, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    return {"message": "Python & SQL Master API Running. Frontend directory not found."}

@app.get("/style.css")
def get_css():
    return FileResponse(os.path.join(STATIC_DIR, "style.css"))

@app.get("/app.js")
def get_js():
    return FileResponse(os.path.join(STATIC_DIR, "app.js"))

@app.get("/curriculum_fallback.js")
def get_fallback():
    return FileResponse(os.path.join(STATIC_DIR, "curriculum_fallback.js"))

@app.get("/health")
def health_check():
    return {"status": "ok", "app": "Python Master Game & SQL Academy", "version": "2.0.0"}

if __name__ == "__main__":
    import uvicorn
    # Render proporciona el puerto a través de la variable PORT; en local usamos 8000
    port = int(os.getenv("PORT", 8000))
    print(f"🚀 Iniciando servidor FastAPI en puerto {port} (0.0.0.0)...")
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
