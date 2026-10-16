import time
import re
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy import text
from database import engine, IS_SQLITE
from seeders.supabase_seeder import seed_database

router = APIRouter(prefix="/api/sql", tags=["SQL Interactive Course"])

class SQLExecuteRequest(BaseModel):
    query: str
    mode: str = "auto"  # 'auto', 'sql', 'nl' (natural language)
    challenge_id: Optional[str] = None
    user_id: str = "default_user"

# Catálogo de Desafíos de SQL (SQL Questline)
SQL_CHALLENGES = [
    {
        "id": "sql_1",
        "title": "Misión 1: Bóveda de Usuarios",
        "level": 1,
        "difficulty": "Básico",
        "xp_reward": 50,
        "objective": "Selecciona el nombre, email y saldo de todos los usuarios registrados.",
        "description": "Aprende la cláusula fundamental SELECT para proyectar columnas específicas de una tabla sin traer datos innecesarios.",
        "starter_query": "SELECT nombre, email, saldo FROM usuarios;",
        "solution_query": "SELECT nombre, email, saldo FROM usuarios;",
        "natural_prompt": "selecciona el nombre, email y saldo de los usuarios",
        "hints": [
            "Usa la sintaxis: SELECT columna1, columna2 FROM nombre_tabla;",
            "Asegúrate de separar las columnas con comas.",
            "No uses asterisco '*' si te piden columnas específicas."
        ]
    },
    {
        "id": "sql_2",
        "title": "Misión 2: Filtro de Clientes VIP",
        "level": 2,
        "difficulty": "Básico-Intermedio",
        "xp_reward": 60,
        "objective": "Encuentra a los usuarios que tengan el rol 'cliente_vip' y un saldo mayor a 2500.",
        "description": "Domina la cláusula WHERE y el operador lógico AND para filtrar filas que cumplan múltiples condiciones.",
        "starter_query": "SELECT * FROM usuarios WHERE rol = 'cliente_vip' AND saldo > 2500;",
        "solution_query": "SELECT * FROM usuarios WHERE rol = 'cliente_vip' AND saldo > 2500;",
        "natural_prompt": "muestra los usuarios vip con saldo mayor a 2500",
        "hints": [
            "Las cadenas en SQL van entre comillas simples: 'cliente_vip'.",
            "Usa el operador '>' para comparar valores numéricos.",
            "El operador AND exige que ambas condiciones sean verdaderas."
        ]
    },
    {
        "id": "sql_3",
        "title": "Misión 3: Inventario Crítico & Ordenamiento",
        "level": 3,
        "difficulty": "Intermedio",
        "xp_reward": 70,
        "objective": "Obtén el nombre, stock y precio de los productos con stock menor o igual a 30, ordenados de menor a mayor stock.",
        "description": "Aprende a priorizar recursos en tu tienda online utilizando WHERE con operadores de comparación y ORDER BY ASC.",
        "starter_query": "SELECT nombre, stock, precio FROM productos WHERE stock <= 30 ORDER BY stock ASC;",
        "solution_query": "SELECT nombre, stock, precio FROM productos WHERE stock <= 30 ORDER BY stock ASC;",
        "natural_prompt": "productos con poco stock ordenados de menor a mayor",
        "hints": [
            "Menor o igual se escribe '<='.",
            "Para ordenar de menor a mayor se usa ORDER BY columna ASC (o simplemente omitir ASC, ya que es el valor por defecto)."
        ]
    },
    {
        "id": "sql_4",
        "title": "Misión 4: Métricas de Reservas de Hotel",
        "level": 4,
        "difficulty": "Intermedio+",
        "xp_reward": 80,
        "objective": "Calcula el total de reservas y el precio promedio por noche agrupado por tipo de habitación.",
        "description": "Utiliza funciones agregadas como COUNT(*) y AVG() combinadas con GROUP BY para generar reportes analíticos de negocio.",
        "starter_query": "SELECT habitacion_tipo, COUNT(*) AS total_reservas, AVG(precio_noche) AS precio_promedio FROM reservas_hotel GROUP BY habitacion_tipo;",
        "solution_query": "SELECT habitacion_tipo, COUNT(*) AS total_reservas, AVG(precio_noche) AS precio_promedio FROM reservas_hotel GROUP BY habitacion_tipo;",
        "natural_prompt": "cuenta cuántas reservas y precio promedio hay por tipo de habitación",
        "hints": [
            "Toda columna no agregada en el SELECT debe estar presente en la cláusula GROUP BY.",
            "Puedes usar alias descriptivos con AS (ej: COUNT(*) AS total_reservas)."
        ]
    },
    {
        "id": "sql_5",
        "title": "Misión 5: Unión Sagrada (INNER JOIN)",
        "level": 5,
        "difficulty": "Avanzado",
        "xp_reward": 100,
        "objective": "Relaciona la tabla de pedidos con usuarios para mostrar el nombre del cliente, el total del pedido y su estado.",
        "description": "Los datos relacionales viven en múltiples tablas. Domina INNER JOIN para conectar llaves foráneas con llaves primarias.",
        "starter_query": "SELECT u.nombre AS cliente, p.total, p.estado FROM pedidos p INNER JOIN usuarios u ON p.usuario_id = u.id;",
        "solution_query": "SELECT u.nombre AS cliente, p.total, p.estado FROM pedidos p INNER JOIN usuarios u ON p.usuario_id = u.id;",
        "natural_prompt": "muestra los pedidos con el nombre del cliente y el estado",
        "hints": [
            "Asigna alias cortos a las tablas para simplificar la lectura: 'pedidos p', 'usuarios u'.",
            "La condición de unión es 'ON p.usuario_id = u.id'."
        ]
    },
    {
        "id": "sql_6",
        "title": "Misión 6: Auditoría Salarial de Recursos Humanos",
        "level": 6,
        "difficulty": "Senior",
        "xp_reward": 120,
        "objective": "Obtén cada departamento, el número de empleados y el salario máximo pagado en dicho departamento.",
        "description": "Demuestra competencia empresarial analizando la estructura salarial de la empresa con GROUP BY y MAX().",
        "starter_query": "SELECT departamento, COUNT(*) AS total_empleados, MAX(salario) AS salario_maximo FROM empleados GROUP BY departamento ORDER BY salario_maximo DESC;",
        "solution_query": "SELECT departamento, COUNT(*) AS total_empleados, MAX(salario) AS salario_maximo FROM empleados GROUP BY departamento ORDER BY salario_maximo DESC;",
        "natural_prompt": "salario maximo y empleados por cada departamento",
        "hints": [
            "Agrupa por la columna 'departamento'.",
            "Usa MAX(salario) para hallar la remuneración más alta.",
            "Ordena con ORDER BY salario_maximo DESC para ver primero los departamentos mejor remunerados."
        ]
    }
]

def translate_natural_language_to_sql(nl_text: str) -> Dict[str, Any]:
    """
    Motor pedagógico de interpretación de lenguaje natural a SQL.
    Traduce órdenes en español a consultas SQL bien formateadas y explicadas.
    """
    clean_text = nl_text.lower().strip()
    
    # Caso 1: Selecciona usuarios / clientes
    if any(k in clean_text for k in ["selecciona el usuario", "selecciona usuario", "selecciona los usuarios", "ver usuarios", "lista de usuarios", "todos los usuarios"]):
        sql = "SELECT id, nombre, email, rol, saldo, activo FROM usuarios;"
        explanation = {
            "SELECT": "id, nombre, email, rol, saldo, activo -> Proyecta las columnas de identificación y datos del usuario.",
            "FROM": "usuarios -> Consulta la tabla principal de usuarios en Supabase/PostgreSQL.",
            "RESUMEN": "Esta consulta recupera la lista completa de usuarios registrados sin filtros restrictivos."
        }
        return {"sql": sql, "explanation": explanation, "interpreted_as": "Selección general de usuarios"}

    # Caso 2: Usuarios VIP / con saldo alto
    if "vip" in clean_text or ("saldo" in clean_text and "mayor" in clean_text):
        sql = "SELECT nombre, email, rol, saldo FROM usuarios WHERE rol = 'cliente_vip' OR saldo > 2000 ORDER BY saldo DESC;"
        explanation = {
            "SELECT": "nombre, email, rol, saldo -> Trae las credenciales y el estado financiero.",
            "FROM": "usuarios -> Tabla de cuentas de usuario.",
            "WHERE": "rol = 'cliente_vip' OR saldo > 2000 -> Filtra únicamente usuarios con categoría VIP o balances altos.",
            "ORDER BY": "saldo DESC -> Ordena de mayor a menor saldo para auditoría.",
            "RESUMEN": "Permite identificar rápidamente a los clientes más valiosos de la plataforma."
        }
        return {"sql": sql, "explanation": explanation, "interpreted_as": "Filtrado de usuarios VIP y saldos altos"}

    # Caso 3: Productos / Inventario / Tienda
    if any(k in clean_text for k in ["producto", "inventario", "stock", "precio", "computacion", "computación"]):
        if "stock" in clean_text and ("poco" in clean_text or "menor" in clean_text or "bajo" in clean_text):
            sql = "SELECT nombre, categoria, precio, stock FROM productos WHERE stock <= 30 ORDER BY stock ASC;"
            explanation = {
                "SELECT": "nombre, categoria, precio, stock -> Datos clave del producto.",
                "FROM": "productos -> Catálogo de la tienda online.",
                "WHERE": "stock <= 30 -> Alerta de inventario crítico (30 unidades o menos).",
                "ORDER BY": "stock ASC -> Los productos más urgentes de reabastecer aparecen primero."
            }
        else:
            sql = "SELECT id, nombre, categoria, precio, stock, sku FROM productos ORDER BY precio DESC;"
            explanation = {
                "SELECT": "* -> Columnas completas del catálogo.",
                "FROM": "productos -> Tabla de inventario.",
                "ORDER BY": "precio DESC -> Ordenados desde el artículo más costoso al más económico."
            }
        return {"sql": sql, "explanation": explanation, "interpreted_as": "Consulta al catálogo de productos"}

    # Caso 4: Reservas de Hotel
    if any(k in clean_text for k in ["reserva", "hotel", "habitacion", "habitación"]):
        sql = "SELECT cliente_nombre, habitacion_tipo, noches, precio_noche, total, estado FROM reservas_hotel WHERE estado = 'confirmada' ORDER BY total DESC;"
        explanation = {
            "SELECT": "cliente_nombre, habitacion_tipo, noches, total, estado -> Resumen de la estancia y facturación.",
            "FROM": "reservas_hotel -> Historial de reservas del hotel.",
            "WHERE": "estado = 'confirmada' -> Excluye reservas canceladas o pendientes de pago.",
            "ORDER BY": "total DESC -> Prioriza las reservas de mayor facturación."
        }
        return {"sql": sql, "explanation": explanation, "interpreted_as": "Gestión de reservas hoteleras"}

    # Caso 5: Pedidos con Clientes (JOIN)
    if any(k in clean_text for k in ["pedido", "pedidos", "compras", "join"]):
        sql = "SELECT p.id AS pedido_num, u.nombre AS cliente, p.total, p.estado, p.fecha FROM pedidos p INNER JOIN usuarios u ON p.usuario_id = u.id ORDER BY p.total DESC;"
        explanation = {
            "SELECT": "p.id, u.nombre, p.total, p.estado -> Combina datos de ambas entidades.",
            "FROM": "pedidos p -> Tabla transaccional de ventas.",
            "INNER JOIN": "usuarios u ON p.usuario_id = u.id -> Relaciona cada pedido con el cliente titular mediante su clave foránea.",
            "ORDER BY": "p.total DESC -> Muestra las compras más cuantiosas primero."
        }
        return {"sql": sql, "explanation": explanation, "interpreted_as": "Unión relacional de pedidos y usuarios"}

    # Caso 6: Empleados / RH / Salarios
    if any(k in clean_text for k in ["empleado", "departamento", "salario", "sueldo"]):
        sql = "SELECT departamento, COUNT(*) AS total_empleados, ROUND(AVG(salario), 2) AS salario_promedio, MAX(salario) AS salario_max FROM empleados GROUP BY departamento ORDER BY salario_promedio DESC;"
        explanation = {
            "SELECT": "departamento, COUNT(*), AVG(salario), MAX(salario) -> Métricas agregadas por grupo.",
            "FROM": "empleados -> Registro de personal de la empresa.",
            "GROUP BY": "departamento -> Agrupa todos los registros que pertenezcan a la misma división.",
            "ORDER BY": "salario_promedio DESC -> Compara qué departamentos tienen mayor nivel salarial."
        }
        return {"sql": sql, "explanation": explanation, "interpreted_as": "Análisis estadístico de salarios por departamento"}

    # Fallback interpretativo
    fallback_sql = "SELECT * FROM usuarios LIMIT 10;"
    return {
        "sql": fallback_sql,
        "explanation": {
            "SELECT": "* -> Selecciona todas las columnas.",
            "FROM": "usuarios -> Tabla base.",
            "LIMIT": "10 -> Restringe la salida a 10 registros para no saturar memoria."
        },
        "interpreted_as": f"Consulta general inferida para '{nl_text}'"
    }

def explain_sql_query(query: str) -> Dict[str, str]:
    """
    Desglosa una consulta SQL arbitraria en explicaciones pedagógicas de sus cláusulas.
    """
    upper_q = query.upper()
    explanations = {}

    if "SELECT" in upper_q:
        explanations["SELECT"] = "Define qué columnas o expresiones calculadas se extraen del motor de base de datos."
    if "FROM" in upper_q:
        explanations["FROM"] = "Indica la tabla de origen o fuente principal de los registros consultados."
    if "WHERE" in upper_q:
        explanations["WHERE"] = "Filtro condicional a nivel de fila. Solo devuelve registros cuya expresión sea verdadera (TRUE)."
    if "JOIN" in upper_q:
        explanations["JOIN"] = "Relaciona dos tablas vinculando su clave foránea con la clave primaria correspondiente."
    if "GROUP BY" in upper_q:
        explanations["GROUP BY"] = "Colapsa múltiples filas en grupos para aplicar funciones agregadas (COUNT, SUM, AVG, MAX)."
    if "HAVING" in upper_q:
        explanations["HAVING"] = "Filtro condicional posterior a la agrupación (aplica sobre resultados agregados)."
    if "ORDER BY" in upper_q:
        explanations["ORDER BY"] = "Determina el orden de presentación de las filas devueltas (ascendente o descendente)."
    if "LIMIT" in upper_q:
        explanations["LIMIT"] = "Acota el número máximo de registros que viajarán a través de la red hacia el cliente."

    return explanations

@router.get("/challenges")
def get_challenges():
    """Retorna la lista de desafíos de SQL con sus pistas y objetivos."""
    return {"challenges": SQL_CHALLENGES}

@router.get("/schema")
def get_schema_info():
    """
    Retorna el diccionario de tablas y columnas disponibles en la base de datos para el explorador visual.
    """
    schema = {
        "usuarios": [
            {"name": "id", "type": "INTEGER", "pk": True},
            {"name": "nombre", "type": "VARCHAR(100)"},
            {"name": "email", "type": "VARCHAR(150)"},
            {"name": "rol", "type": "VARCHAR(50)"},
            {"name": "saldo", "type": "NUMERIC(10,2)"},
            {"name": "activo", "type": "BOOLEAN"}
        ],
        "productos": [
            {"name": "id", "type": "INTEGER", "pk": True},
            {"name": "nombre", "type": "VARCHAR(120)"},
            {"name": "categoria", "type": "VARCHAR(80)"},
            {"name": "precio", "type": "NUMERIC(10,2)"},
            {"name": "stock", "type": "INTEGER"},
            {"name": "sku", "type": "VARCHAR(50)"}
        ],
        "reservas_hotel": [
            {"name": "id", "type": "INTEGER", "pk": True},
            {"name": "cliente_nombre", "type": "VARCHAR(120)"},
            {"name": "habitacion_tipo", "type": "VARCHAR(50)"},
            {"name": "noches", "type": "INTEGER"},
            {"name": "precio_noche", "type": "NUMERIC(10,2)"},
            {"name": "total", "type": "NUMERIC(10,2)"},
            {"name": "estado", "type": "VARCHAR(30)"}
        ],
        "pedidos": [
            {"name": "id", "type": "INTEGER", "pk": True},
            {"name": "usuario_id", "type": "INTEGER", "fk": "usuarios.id"},
            {"name": "producto_id", "type": "INTEGER", "fk": "productos.id"},
            {"name": "cantidad", "type": "INTEGER"},
            {"name": "total", "type": "NUMERIC(10,2)"},
            {"name": "estado", "type": "VARCHAR(50)"}
        ],
        "empleados": [
            {"name": "id", "type": "INTEGER", "pk": True},
            {"name": "nombre", "type": "VARCHAR(120)"},
            {"name": "departamento", "type": "VARCHAR(80)"},
            {"name": "salario", "type": "NUMERIC(10,2)"},
            {"name": "fecha_ingreso", "type": "DATE"}
        ]
    }
    return {"tables": schema}

@router.post("/execute")
def execute_sql(payload: SQLExecuteRequest):
    """
    Ejecuta consultas SQL o traduce lenguaje natural didácticamente,
    retornando filas, columnas, métricas y validación de retos.
    """
    raw_query = payload.query.strip()
    if not raw_query:
        raise HTTPException(status_code=400, detail="La consulta no puede estar vacía.")

    is_nl = False
    interpreted_query = raw_query
    explanation = {}
    interpretation_note = None

    # Detectar si es lenguaje natural
    starts_with_sql = any(raw_query.upper().startswith(kw) for kw in ["SELECT", "INSERT", "UPDATE", "DELETE", "WITH", "EXPLAIN"])
    if payload.mode == "nl" or (payload.mode == "auto" and not starts_with_sql):
        is_nl = True
        nl_result = translate_natural_language_to_sql(raw_query)
        interpreted_query = nl_result["sql"]
        explanation = nl_result["explanation"]
        interpretation_note = nl_result["interpreted_as"]
    else:
        explanation = explain_sql_query(raw_query)

    # Protección de seguridad reforzada en Sandbox SQL
    INTERNAL_PROTECTED_TABLES = [
        "user_accounts", "user_profiles", "user_progress", 
        "code_submissions", "sql_submissions", "achievements",
        "pg_catalog", "information_schema"
    ]
    for tbl in INTERNAL_PROTECTED_TABLES:
        if re.search(r'\b' + re.escape(tbl) + r'\b', interpreted_query, re.IGNORECASE):
            raise HTTPException(
                status_code=403,
                detail=f"🛡️ [SANDBOX SHIELD] Acceso denegado: La entidad '{tbl}' es un recurso interno del sistema protegido contra consultas de alumnos."
            )

    forbidden_keywords = ["DROP ", "ALTER ", "TRUNCATE ", "GRANT ", "REVOKE ", "PG_SLEEP", "PG_READ_FILE", "DBLINK", "LO_IMPORT", ";--", "--"]
    for word in forbidden_keywords:
        if word in interpreted_query.upper():
            raise HTTPException(status_code=403, detail=f"🛡️ [SANDBOX SHIELD] Instrucción restringida en el entorno interactivo: {word.strip()}")

    # Ejecutar consulta
    start_time = time.time()
    try:
        with engine.connect() as conn:
            if not IS_SQLITE:
                try:
                    conn.execute(text("SET TRANSACTION READ ONLY;"))
                except Exception:
                    pass
            cursor = conn.execute(text(interpreted_query))
            duration_ms = round((time.time() - start_time) * 1000, 2)

            if cursor.returns_rows:
                columns = list(cursor.keys())
                raw_rows = cursor.fetchmany(100)  # Límite seguro de 100 filas
                rows = []
                for r in raw_rows:
                    row_dict = {}
                    for col, val in zip(columns, r):
                        # Convertir fechas/decimales a tipos serializables
                        if hasattr(val, "isoformat"):
                            row_dict[col] = val.isoformat()
                        elif isinstance(val, (int, float, str, bool)) or val is None:
                            row_dict[col] = val
                        else:
                            row_dict[col] = str(val)
                    rows.append(row_dict)
                total_count = len(rows)
            else:
                conn.commit()
                columns = ["filas_afectadas"]
                rows = [{"filas_afectadas": cursor.rowcount}]
                total_count = cursor.rowcount

        # Validación del Desafío (si aplica)
        passed = False
        xp_earned = 0
        feedback = ""
        
        if payload.challenge_id:
            # Buscar el reto
            ch = next((c for c in SQL_CHALLENGES if c["id"] == payload.challenge_id), None)
            if ch:
                # Comprobación básica de cumplimiento
                if total_count > 0:
                    passed = True
                    xp_earned = ch["xp_reward"]
                    feedback = f"¡Excelente trabajo! Has completado '{ch['title']}' y ganado +{xp_earned} XP."
                else:
                    feedback = "La consulta se ejecutó, pero no devolvió registros acordes al objetivo del reto."

        return {
            "success": True,
            "is_natural_language": is_nl,
            "raw_input": raw_query,
            "sql_query": interpreted_query,
            "columns": columns,
            "rows": rows,
            "total_rows": total_count,
            "execution_ms": duration_ms,
            "explanation": explanation,
            "interpretation_note": interpretation_note,
            "passed": passed,
            "xp_earned": xp_earned,
            "feedback": feedback
        }

    except Exception as e:
        duration_ms = round((time.time() - start_time) * 1000, 2)
        return {
            "success": False,
            "is_natural_language": is_nl,
            "raw_input": raw_query,
            "sql_query": interpreted_query,
            "error": str(e),
            "execution_ms": duration_ms,
            "explanation": explanation,
            "hint": "Verifica los nombres de las tablas y columnas. Puedes consultar el explorador de tablas lateral para ver la estructura exacta."
        }

@router.post("/seed")
def seed_database_endpoint():
    """Endpoint para sembrar o restablecer los datos de Supabase/SQLite desde la interfaz web."""
    try:
        res = seed_database()
        return {"status": "success", "message": "Base de datos sembrada correctamente con datos de prueba.", "details": res}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al sembrar la base de datos: {str(e)}")
