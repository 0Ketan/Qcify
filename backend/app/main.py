from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import circuit, mascot

app = FastAPI(title="Qcify Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(circuit.router)
app.include_router(mascot.router)
