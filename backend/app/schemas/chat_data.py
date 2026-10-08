from typing import Optional, List
from pydantic import BaseModel, Field

class ChatMessage(BaseModel):
    role: str = Field(..., description="Role: 'user', 'assistant', or 'system'")
    content: str = Field(..., description="Message text content")

class MascotChatRequest(BaseModel):
    message: str = Field(..., description="User query or question to Schrö")
    context: Optional[str] = Field("dashboard", description="Current page/context: 'dashboard', 'lesson', 'sandbox', 'quiz'")
    history: Optional[List[ChatMessage]] = Field(default_factory=list, description="Recent conversation turns")
    current_topic: Optional[str] = Field("superposition", description="Quantum topic in focus")

class MascotChatResponse(BaseModel):
    reply: str = Field(..., description="Schrö's verbal reply")
    expression: str = Field("happy", description="Suggested Schrö expression: idle, thinking, happy, encouraging, excited")
    hint_available: bool = Field(True, description="Whether a progressive hint ladder is available")
    suggested_action: Optional[str] = None

class HintRequest(BaseModel):
    topic: str = Field(..., description="Topic identifier (e.g. superposition, hadamard, entanglement)")
    step: int = Field(1, ge=1, le=3, description="Hint ladder tier (1, 2, or 3)")

class HintResponse(BaseModel):
    topic: str
    step: int
    hint: str
    expression: str = "thinking"
    has_next: bool
