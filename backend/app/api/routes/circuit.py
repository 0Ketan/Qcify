from fastapi import APIRouter, HTTPException
from typing import Dict, Any, List
from app.schemas.circuit_data import CircuitRequest, CircuitResponse, GateOperation
from app.services.qiskit_runner import simulator_service

router = APIRouter(prefix="/circuit", tags=["Quantum Circuit"])

@router.post("/simulate", response_model=CircuitResponse)
async def simulate_circuit(request: CircuitRequest):
    """
    Simulate a quantum circuit and return probabilities, statevectors,
    counts, and Bloch sphere coordinates.
    """
    try:
        response = simulator_service.simulate(request)
        return response
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Simulation error: {str(e)}")

@router.get("/backends")
async def get_backends():
    """List available quantum execution backends."""
    return {
        "backends": [
            {
                "id": "qiskit_aer",
                "name": "Qiskit Aer Simulator",
                "qubits": 32,
                "status": "online",
                "type": "simulator"
            },
            {
                "id": "statevector_exact",
                "name": "Analytical Matrix Statevector Engine",
                "qubits": 5,
                "status": "online",
                "type": "analytical"
            },
            {
                "id": "ibm_falcon_mock",
                "name": "IBM Quantum Falcon (Emulated)",
                "qubits": 7,
                "status": "online",
                "type": "emulated_hardware"
            }
        ]
    }

@router.get("/presets/{preset_name}")
async def get_preset_circuit(preset_name: str):
    """Fetch pre-configured educational quantum circuits."""
    name = preset_name.lower()
    
    if name == "bell_state":
        return {
            "name": "Bell State (|Φ⁺⟩)",
            "description": "Maximally entangled pair created via Hadamard + CNOT",
            "num_qubits": 2,
            "gates": [
                {"name": "H", "target": 0, "control": None, "step": 0},
                {"name": "CNOT", "target": 1, "control": 0, "step": 1}
            ]
        }
    elif name == "superposition":
        return {
            "name": "Single Qubit Superposition",
            "description": "Equal 50/50 probability coin flip",
            "num_qubits": 1,
            "gates": [
                {"name": "H", "target": 0, "control": None, "step": 0}
            ]
        }
    elif name == "ghz":
        return {
            "name": "GHZ State (|000⟩ + |111⟩)/√2",
            "description": "3-qubit maximally entangled Greenberger–Horne–Zeilinger state",
            "num_qubits": 3,
            "gates": [
                {"name": "H", "target": 0, "control": None, "step": 0},
                {"name": "CNOT", "target": 1, "control": 0, "step": 1},
                {"name": "CNOT", "target": 2, "control": 1, "step": 2}
            ]
        }
    else:
        raise HTTPException(status_code=404, detail="Preset circuit not found. Available: bell_state, superposition, ghz")
