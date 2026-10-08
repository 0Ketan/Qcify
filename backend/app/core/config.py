import os
from typing import List
try:
    from pydantic_settings import BaseSettings
except ImportError:
    from pydantic import BaseModel as BaseSettings

class Settings(BaseSettings):
    app_name: str = "Qcify API"
    app_env: str = "development"
    debug: bool = True
    port: int = 8000
    host: str = "0.0.0.0"
    
    cors_origins: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "*"
    ]
    
    gemini_api_key: str = os.getenv("GEMINI_API_KEY", "")
    default_model: str = "gemini-2.5-flash"

    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()
