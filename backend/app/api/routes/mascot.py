from fastapi import APIRouter, HTTPException, status
from app.schemas.chat_data import ChatRequest, ChatResponse
from app.services.llm_service import get_llm_response

router = APIRouter(prefix="/mascot", tags=["mascot"])


@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(chat_request: ChatRequest):
    """
    Handle a chat message from the user and return a response from the Schrö mascot.
    """
    try:
        # Call the LLM service to get a response
        result = await get_llm_response(chat_request)
        return ChatResponse(**result)
    except Exception as e:
        # Log the error (in a real app, we would use logging)
        # For now, we'll return a fallback response to avoid breaking the client
        # But note: the llm_service already returns a fallback on error, so this is just a safety net.
        fallback_msg = "Sorry, I'm having trouble connecting to my quantum brain right now. Please try again!"
        return ChatResponse(reply=fallback_msg, source="fallback")