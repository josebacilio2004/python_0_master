from fastapi import APIRouter
from curriculum_data import CURRICULUM

router = APIRouter(prefix="/api/modules", tags=["Modules"])

@router.get("")
def get_all_modules():
    """Retorna el resumen de todos los bloques y sus lecciones"""
    summary = []
    for block in CURRICULUM:
        summary.append({
            "id": block["id"],
            "title": block["title"],
            "days": block["days"],
            "icon": block["icon"],
            "description": block["description"],
            "lessons_count": len(block["lessons"])
        })
    return {"modules": summary}

@router.get("/{block_id}")
def get_block_details(block_id: str):
    """Retorna los detalles completos de un bloque con sus lecciones"""
    for block in CURRICULUM:
        if block["id"] == block_id:
            return {"block": block}
    return {"error": "Bloque no encontrado"}

@router.get("/{block_id}/lesson/{lesson_id}")
def get_lesson_details(block_id: str, lesson_id: str):
    """Retorna la teoría, cuestionario y ejercicio de una lección específica"""
    for block in CURRICULUM:
        if block["id"] == block_id:
            for lesson in block["lessons"]:
                if lesson["id"] == lesson_id:
                    return {"lesson": lesson}
    return {"error": "Lección no encontrada"}
