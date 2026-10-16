import sys
import os

if sys.stdout and hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from sqlalchemy import text
from database import engine, IS_SQLITE

def seed_database():
    """
    Crea y siembra las tablas pedagógicas (usuarios, productos, reservas_hotel, pedidos, empleados)
    en Supabase (PostgreSQL) o SQLite.
    """
    db_type = 'SQLite' if IS_SQLITE else 'PostgreSQL/Supabase'
    print(f"[SEEDER] Iniciando siembra de base de datos ({db_type})...")

    with engine.begin() as conn:
        if IS_SQLITE:
            # DDL compatible con SQLite
            conn.execute(text("""
            CREATE TABLE IF NOT EXISTS usuarios (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                rol TEXT DEFAULT 'estudiante',
                saldo REAL DEFAULT 0.00,
                activo INTEGER DEFAULT 1,
                fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            """))

            conn.execute(text("""
            CREATE TABLE IF NOT EXISTS productos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT NOT NULL,
                categoria TEXT NOT NULL,
                precio REAL NOT NULL,
                stock INTEGER NOT NULL,
                sku TEXT UNIQUE NOT NULL
            );
            """))

            conn.execute(text("""
            CREATE TABLE IF NOT EXISTS reservas_hotel (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                cliente_nombre TEXT NOT NULL,
                habitacion_tipo TEXT NOT NULL,
                noches INTEGER NOT NULL,
                precio_noche REAL NOT NULL,
                total REAL NOT NULL,
                estado TEXT DEFAULT 'confirmada',
                fecha_reserva DATE DEFAULT CURRENT_DATE
            );
            """))

            conn.execute(text("""
            CREATE TABLE IF NOT EXISTS pedidos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                usuario_id INTEGER,
                producto_id INTEGER,
                cantidad INTEGER NOT NULL DEFAULT 1,
                total REAL NOT NULL,
                estado TEXT DEFAULT 'pagado',
                fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY(usuario_id) REFERENCES usuarios(id),
                FOREIGN KEY(producto_id) REFERENCES productos(id)
            );
            """))

            conn.execute(text("""
            CREATE TABLE IF NOT EXISTS empleados (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT NOT NULL,
                departamento TEXT NOT NULL,
                salario REAL NOT NULL,
                fecha_ingreso DATE NOT NULL
            );
            """))

            # Limpiar datos existentes
            conn.execute(text("DELETE FROM pedidos;"))
            conn.execute(text("DELETE FROM reservas_hotel;"))
            conn.execute(text("DELETE FROM productos;"))
            conn.execute(text("DELETE FROM usuarios;"))
            conn.execute(text("DELETE FROM empleados;"))

        else:
            # DDL PostgreSQL / Supabase
            conn.execute(text("""
            CREATE TABLE IF NOT EXISTS usuarios (
                id SERIAL PRIMARY KEY,
                nombre VARCHAR(100) NOT NULL,
                email VARCHAR(150) UNIQUE NOT NULL,
                rol VARCHAR(50) DEFAULT 'estudiante',
                saldo NUMERIC(10, 2) DEFAULT 0.00,
                activo BOOLEAN DEFAULT TRUE,
                fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            """))

            conn.execute(text("""
            CREATE TABLE IF NOT EXISTS productos (
                id SERIAL PRIMARY KEY,
                nombre VARCHAR(120) NOT NULL,
                categoria VARCHAR(80) NOT NULL,
                precio NUMERIC(10, 2) NOT NULL,
                stock INTEGER NOT NULL,
                sku VARCHAR(50) UNIQUE NOT NULL
            );
            """))

            conn.execute(text("""
            CREATE TABLE IF NOT EXISTS reservas_hotel (
                id SERIAL PRIMARY KEY,
                cliente_nombre VARCHAR(120) NOT NULL,
                habitacion_tipo VARCHAR(50) NOT NULL,
                noches INTEGER NOT NULL,
                precio_noche NUMERIC(10, 2) NOT NULL,
                total NUMERIC(10, 2) NOT NULL,
                estado VARCHAR(30) DEFAULT 'confirmada',
                fecha_reserva DATE DEFAULT CURRENT_DATE
            );
            """))

            conn.execute(text("""
            CREATE TABLE IF NOT EXISTS pedidos (
                id SERIAL PRIMARY KEY,
                usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
                producto_id INTEGER REFERENCES productos(id) ON DELETE CASCADE,
                cantidad INTEGER NOT NULL DEFAULT 1,
                total NUMERIC(10, 2) NOT NULL,
                estado VARCHAR(50) DEFAULT 'pagado',
                fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            """))

            conn.execute(text("""
            CREATE TABLE IF NOT EXISTS empleados (
                id SERIAL PRIMARY KEY,
                nombre VARCHAR(120) NOT NULL,
                departamento VARCHAR(80) NOT NULL,
                salario NUMERIC(10, 2) NOT NULL,
                fecha_ingreso DATE NOT NULL
            );
            """))

            conn.execute(text("TRUNCATE TABLE pedidos, reservas_hotel, productos, usuarios, empleados RESTART IDENTITY CASCADE;"))

        # Inserción de Usuarios
        usuarios_data = [
            ("Carlos Mendoza", "carlos.mendoza@empresa.com", "admin", 1540.50, True),
            ("Ana Gómez", "ana.gomez@empresa.com", "cliente_vip", 2890.00, True),
            ("Mateo Fernández", "mateo.fernandez@empresa.com", "cliente", 120.00, True),
            ("Lucía Morales", "lucia.morales@empresa.com", "cliente_vip", 4500.75, True),
            ("Santiago Herrera", "santiago.herrera@empresa.com", "cliente", 0.00, False),
            ("Valentina Ríos", "valentina.rios@empresa.com", "editor", 820.30, True),
            ("Joaquín Paredes", "joaquin.paredes@empresa.com", "cliente", 310.00, True),
            ("Elena Torres", "elena.torres@empresa.com", "cliente_vip", 3400.20, True)
        ]
        for u in usuarios_data:
            conn.execute(
                text("INSERT INTO usuarios (nombre, email, rol, saldo, activo) VALUES (:n, :e, :r, :s, :a)"),
                {"n": u[0], "e": u[1], "r": u[2], "s": u[3], "a": 1 if (IS_SQLITE and u[4]) else u[4]}
            )

        # Inserción de Productos
        productos_data = [
            ("Laptop Pro 16\"", "Computación", 1499.99, 15, "COMP-LAP-001"),
            ("Mouse Ergonómico Inalámbrico", "Accesorios", 45.50, 80, "ACC-MOU-002"),
            ("Teclado Mecánico RGB", "Accesorios", 89.90, 45, "ACC-TEC-003"),
            ("Monitor 4K 27\" IPS", "Monitores", 389.00, 22, "MON-4K-004"),
            ("Auriculares Noise Cancelling", "Audio", 199.99, 30, "AUD-NOI-005"),
            ("Servidor Rack 1U 64GB", "Servidores", 2850.00, 6, "SRV-RCK-006"),
            ("Memoria RAM DDR5 32GB", "Componentes", 129.50, 65, "CMP-RAM-007"),
            ("Disco SSD NVMe 2TB", "Almacenamiento", 145.00, 50, "ALM-SSD-008")
        ]
        for p in productos_data:
            conn.execute(
                text("INSERT INTO productos (nombre, categoria, precio, stock, sku) VALUES (:n, :c, :pr, :st, :sku)"),
                {"n": p[0], "c": p[1], "pr": p[2], "st": p[3], "sku": p[4]}
            )

        # Inserción de Reservas
        reservas_data = [
            ("Ana Gómez", "Suite Vista al Mar", 4, 180.00, 720.00, "confirmada"),
            ("Carlos Mendoza", "Habitación Estándar", 2, 75.00, 150.00, "completada"),
            ("Lucía Morales", "Suite Presidencial", 5, 320.00, 1600.00, "confirmada"),
            ("Santiago Herrera", "Habitación Estándar", 1, 75.00, 75.00, "cancelada"),
            ("Elena Torres", "Suite Vista al Mar", 3, 180.00, 540.00, "confirmada"),
            ("Roberto Ruiz", "Habitación Doble", 2, 110.00, 220.00, "pendiente")
        ]
        for r in reservas_data:
            conn.execute(
                text("INSERT INTO reservas_hotel (cliente_nombre, habitacion_tipo, noches, precio_noche, total, estado) VALUES (:c, :h, :n, :p, :t, :e)"),
                {"c": r[0], "h": r[1], "n": r[2], "p": r[3], "t": r[4], "e": r[5]}
            )

        # Inserción de Pedidos
        pedidos_data = [
            (1, 1, 1, 1499.99, "pagado"),
            (2, 3, 2, 179.80, "pagado"),
            (2, 4, 1, 389.00, "pagado"),
            (3, 2, 1, 45.50, "entregado"),
            (4, 6, 1, 2850.00, "pagado"),
            (4, 5, 2, 399.98, "en_camino"),
            (6, 8, 2, 290.00, "pagado"),
            (7, 7, 1, 129.50, "pendiente")
        ]
        for ped in pedidos_data:
            conn.execute(
                text("INSERT INTO pedidos (usuario_id, producto_id, cantidad, total, estado) VALUES (:u, :p, :c, :t, :e)"),
                {"u": ped[0], "p": ped[1], "c": ped[2], "t": ped[3], "e": ped[4]}
            )

        # Inserción de Empleados
        empleados_data = [
            ("Rodrigo Vega", "Tecnología", 4800.00, "2021-03-15"),
            ("Mariana Castro", "Recursos Humanos", 3200.00, "2022-01-10"),
            ("David Salazar", "Tecnología", 5400.00, "2020-07-01"),
            ("Gabriela Lima", "Finanzas", 3900.00, "2021-11-20"),
            ("Felipe Ortiz", "Ventas", 2800.00, "2023-02-14"),
            ("Patricia Méndez", "Tecnología", 4100.00, "2022-09-01"),
            ("Andrés Navarro", "Operaciones", 3100.00, "2023-05-18")
        ]
        for emp in empleados_data:
            conn.execute(
                text("INSERT INTO empleados (nombre, departamento, salario, fecha_ingreso) VALUES (:n, :d, :s, :f)"),
                {"n": emp[0], "d": emp[1], "s": emp[2], "f": emp[3]}
            )

    print("[SEEDER] Siembra completada con éxito.")
    return {
        "status": "success",
        "tables_seeded": ["usuarios", "productos", "reservas_hotel", "pedidos", "empleados"],
        "records_count": {
            "usuarios": len(usuarios_data),
            "productos": len(productos_data),
            "reservas_hotel": len(reservas_data),
            "pedidos": len(pedidos_data),
            "empleados": len(empleados_data)
        }
    }

if __name__ == "__main__":
    seed_database()
