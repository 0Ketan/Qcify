import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routes.circuit import router as circuit_router
from app.api.routes.mascot import router as mascot_router

app = FastAPI(
    title=settings.app_name,
    description="QuantumPaws Backend: Real-time Qiskit quantum circuit simulator & Schrö AI Mentor",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Routers
app.include_router(circuit_router, prefix="/api")
app.include_router(mascot_router, prefix="/api")

@app.get("/")
async def root():
    return {
        "app": "QuantumPaws Backend",
        "version": "2.0.0",
        "edition": "Human Lab Edition",
        "status": "online",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "quantum_engine": "ready",
        "schro_status": "purring in superposition"
    }

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug
    )
