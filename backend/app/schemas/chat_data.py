from pydantic import BaseModel, Field
from typing import List, Literal, Optional


class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str = Field(..., min_length=1, max_length=1000)


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=1000)
    history: List[ChatMessage] = Field(default_factory=list)
    player_name: str = Field(..., min_length=1)
    track: Literal["newbie", "intermediate", "advanced"]
    current_route: str


class ChatResponse(BaseModel):
    reply: str
    source: Literal["nvidia", "fallback"]