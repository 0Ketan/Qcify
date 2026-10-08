from typing import List, Dict, Optional, Any
from pydantic import BaseModel, Field

class GateOperation(BaseModel):
    name: str = Field(..., description="Gate identifier: H, X, Y, Z, S, T, CNOT, SWAP, M")
    target: int = Field(..., description="Target qubit index")
    control: Optional[int] = Field(None, description="Control qubit index for 2-qubit gates like CNOT")
    step: int = Field(0, description="Column / time step on the circuit wire")
    params: Optional[List[float]] = Field(default_factory=list, description="Optional angle parameters for rotation gates")

class CircuitRequest(BaseModel):
    num_qubits: int = Field(2, ge=1, le=5, description="Number of qubits in the circuit (1-5)")
    gates: List[GateOperation] = Field(default_factory=list, description="Ordered or positioned gates in circuit")
    shots: int = Field(1024, ge=1, le=8192, description="Number of measurement shots")
    backend_name: Optional[str] = Field("qiskit_aer", description="Simulator backend to execute on")

class BlochVector(BaseModel):
    qubit: int
    x: float
    y: float
    z: float

class CircuitResponse(BaseModel):
    success: bool
    num_qubits: int
    depth: int
    probabilities: Dict[str, float]
    counts: Dict[str, int]
    statevector: List[Dict[str, float]] # List of {real: float, imag: float}
    bloch_vectors: List[BlochVector]
    execution_time_ms: float
    backend_used: str
    qasm_str: Optional[str] = None
    message: Optional[str] = None
