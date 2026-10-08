from fastapi import APIRouter, HTTPException, status
from typing import Union

from app.schemas.circuit_data import CircuitRequestA, CircuitRequestB, CircuitResponse
from app.services.qiskit_runner import run_circuit

router = APIRouter(prefix="/circuit", tags=["circuit"])


@router.post("/execute", response_model=CircuitResponse)
async def execute_circuit(circuit_data: Union[CircuitRequestA, CircuitRequestB]):
    """
    Execute a quantum circuit.

    Accepts either:
    A) Gate-based specification with framework, num_qubits, shots, gates, measure_all
    B) QASM-based specification with framework, qasm, shots
    """
    try:
        result = run_circuit(circuit_data)
        return result
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )


@router.get("/frameworks")
async def get_frameworks():
    """
    Get available quantum frameworks and their status.
    """
    return [
        {"id": "qiskit", "name": "Qiskit", "status": "available"},
        {"id": "pennylane", "name": "PennyLane", "status": "coming_soon"},
        {"id": "cirq", "name": "Cirq", "status": "coming_soon"},
        {"id": "qbraid", "name": "QBraid", "status": "coming_soon"}
    ]


@router.get("/health")
async def health_check():
    """
    Health check endpoint.
    """
    return {"status": "ok"}