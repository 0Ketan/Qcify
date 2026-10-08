from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    app_name: str = "Qcify Backend"
    allowed_origins: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000"
    ]
    max_qubits: int = 10
    max_shots: int = 8192
    nvidia_api_key: str
    nvidia_base_url: str
    nvidia_model: str

    class Config:
        env_file = ".env"
        case_sensitive = False
        extra = "ignore"


settings = Settings()