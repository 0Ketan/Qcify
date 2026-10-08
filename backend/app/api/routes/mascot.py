from fastapi import APIRouter, HTTPException, Query
from app.schemas.chat_data import MascotChatRequest, MascotChatResponse, HintRequest, HintResponse
from app.services.llm_service import llm_service

router = APIRouter(prefix="/mascot", tags=["Schrö Mascot"])

@router.post("/chat", response_model=MascotChatResponse)
async def chat_with_schro(request: MascotChatRequest):
    """
    Talk to Schrö, your AI quantum cat mentor.
    Receives user query, returns humorous pedagogical explanation with expression.
    """
    try:
        response = await llm_service.get_schro_reply(request)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Mascot communication error: {str(e)}")

@router.get("/hints/{topic}", response_model=HintResponse)
async def get_topic_hint(topic: str, step: int = Query(1, ge=1, le=3)):
    """
    Fetch a pedagogical hint step from Schrö's progressive hint ladder.
    """
    try:
        response = llm_service.get_hint(topic, step)
        return response
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/status")
async def get_schro_status():
    """Returns Schrö's current quantum state and encouraging quote."""
    return {
        "name": "Schrö",
        "quantum_state": "|ψ⟩ = (1/√2)|alive⟩ + (1/√2)|napping⟩",
        "current_expression": "happy",
        "daily_wisdom": "A qubit in hand is worth two in superposition!",
        "unlocked_paws": 4
    }
