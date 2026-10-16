import ast
import random
from typing import Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/api/microapps", tags=["Micro-Programas Didácticos"])

class CalcRequest(BaseModel):
    expression: str

class IdEmailRequest(BaseModel):
    nombre: str
    apellido: str
    anio_nacimiento: int
    empresa: str = "empresa"

class HotelBookingRequest(BaseModel):
    cliente: str
    noches: int
    tipo_habitacion: str  # 'estandar', 'vista_mar', 'presidencial'
    incluye_desayuno: bool = False

@router.post("/calculator")
def evaluate_expression(payload: CalcRequest):
    """
    Evalúa expresiones aritméticas de forma segura usando AST de Python
    y devuelve la precedencia de operadores y el árbol de sintaxis.
    """
    expr = payload.expression.strip()
    if not expr:
        raise HTTPException(status_code=400, detail="Expresión vacía")

    # Validación con AST seguro (solo operaciones matemáticas)
    try:
        node = ast.parse(expr, mode='eval')
        for subnode in ast.walk(node):
            if isinstance(subnode, (ast.Call, ast.Import, ast.ImportFrom, ast.Attribute, ast.Name)):
                raise HTTPException(status_code=400, detail="Solo se permiten expresiones matemáticas puras.")
        
        # Evaluación segura
        result = eval(compile(node, '<string>', 'eval'), {"__builtins__": {}})
        result_type = type(result).__name__

        return {
            "success": True,
            "expression": expr,
            "result": result,
            "type": result_type,
            "explanation": f"Expresión evaluada bajo el estándar CPython. Tipo devuelto: <class '{result_type}'>.",
            "operator_precedence": [
                "1. Paréntesis ()",
                "2. Exponenciación (**)",
                "3. Multiplicación, División, Módulo, División Entera (*, /, %, //)",
                "4. Suma y Resta (+, -)"
            ]
        }
    except Exception as e:
        return {
            "success": False,
            "expression": expr,
            "error": f"Error de sintaxis matemática: {str(e)}"
        }

@router.post("/generate_id_email")
def generate_id_email(payload: IdEmailRequest):
    """
    Retos 40 y 53 de Universidad Python:
    Generador de ID Único normalizado y Email Corporativo.
    """
    n = payload.nombre.strip()
    a = payload.apellido.strip()
    anio_str = str(payload.anio_nacimiento).strip()
    emp = payload.empresa.strip().lower().replace(" ", "")

    if len(n) < 2 or len(a) < 2:
        raise HTTPException(status_code=400, detail="El nombre y apellido deben tener al menos 2 caracteres.")

    # Generación de ID (Reto 53)
    id_nombre = n[:2].upper()
    id_apellido = a[:2].upper()
    id_anio = anio_str[-2:] if len(anio_str) >= 2 else "00"
    id_random = random.randint(1000, 9999)
    id_unico = f"{id_nombre}{id_apellido}{id_anio}{id_random}"

    # Generación de Email (Reto 40)
    email = f"{n.lower().replace(' ', '')}.{a.lower().replace(' ', '')}@{emp}.com"

    return {
        "success": True,
        "id_unico": id_unico,
        "email_corporativo": email,
        "desglose": {
            "slicing_nombre": f"'{n}'[:2].upper() -> '{id_nombre}'",
            "slicing_apellido": f"'{a}'[:2].upper() -> '{id_apellido}'",
            "slicing_anio": f"'{anio_str}'[-2:] -> '{id_anio}'",
            "numero_aleatorio": f"random.randint(1000, 9999) -> {id_random}",
            "metodos_string_email": f"'{n}'.lower().strip() + '.' + '{a}'.lower().strip() + '@{emp}.com'"
        }
    }

@router.post("/hotel_booking")
def calculate_hotel_booking(payload: HotelBookingRequest):
    """
    Retos 20 y 95 de Universidad Python:
    Sistema de Reserva de Hoteles con tarifas dinámicas y descuentos.
    """
    precios_base = {
        "estandar": 75.00,
        "vista_mar": 180.00,
        "presidencial": 320.00
    }
    tipo = payload.tipo_habitacion.lower()
    tarifa_noche = precios_base.get(tipo, 75.00)

    subtotal = tarifa_noche * payload.noches
    desayuno_costo = (20.00 * payload.noches) if payload.incluye_desayuno else 0.00
    
    # Descuento del 10% si se hospeda más de 3 noches (Reto 89/95)
    descuento_pct = 0.10 if payload.noches > 3 else 0.00
    descuento_monto = subtotal * descuento_pct

    total = subtotal - descuento_monto + desayuno_costo

    return {
        "success": True,
        "cliente": payload.cliente,
        "tipo_habitacion": tipo,
        "noches": payload.noches,
        "tarifa_noche": tarifa_noche,
        "subtotal": round(subtotal, 2),
        "descuento_aplicado": round(descuento_monto, 2),
        "desayuno_costo": round(desayuno_costo, 2),
        "total_a_pagar": round(total, 2),
        "reglas_negocio": [
            f"Tarifa diaria ({tipo}): ${tarifa_noche}/noche.",
            "Descuento de larga estancia (> 3 noches): 10% aplicado." if descuento_pct > 0 else "Sin descuento de estancia (<= 3 noches).",
            f"Desayuno buffet incluido: ${desayuno_costo}" if payload.incluye_desayuno else "Sin servicio de desayuno."
        ]
    }
