import os
import sys
import re
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base

# Evitar UnicodeEncodeError en terminales Windows cp1252
if sys.stdout and hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

load_dotenv()

# Prioridad: SUPABASE_DB_URL -> DATABASE_URL -> Local Postgres -> SQLite Fallback
RAW_DB_URL = os.getenv("SUPABASE_DB_URL") or os.getenv("DATABASE_URL")

if not RAW_DB_URL:
    RAW_DB_URL = "postgresql://postgres:postgres@localhost:5433/python_master"

# En SQLAlchemy 1.4+ y 2.0+, la URL debe comenzar con postgresql:// en lugar de postgres://
if RAW_DB_URL.startswith("postgres://"):
    RAW_DB_URL = RAW_DB_URL.replace("postgres://", "postgresql://", 1)

SQLITE_FALLBACK_URL = "sqlite:///./python_master_game.db"

Base = declarative_base()

def init_engine():
    global RAW_DB_URL
    is_sqlite = False

    try:
        connect_args = {"connect_timeout": 3}
        if "sqlite" in RAW_DB_URL:
            connect_args = {"check_same_thread": False}
            is_sqlite = True
            
        temp_engine = create_engine(
            RAW_DB_URL,
            pool_pre_ping=True,
            connect_args=connect_args
        )
        with temp_engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        print(f"[DB] Conectado exitosamente a: {RAW_DB_URL.split('@')[-1] if '@' in RAW_DB_URL else 'SQLite/Local'}")
        return temp_engine, is_sqlite
    except Exception as e:
        print(f"[DB] Advertencia: BD principal no disponible. Usando fallback SQLite local...")
        fallback_engine = create_engine(
            SQLITE_FALLBACK_URL,
            connect_args={"check_same_thread": False}
        )
        return fallback_engine, True

engine, IS_SQLITE = init_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
