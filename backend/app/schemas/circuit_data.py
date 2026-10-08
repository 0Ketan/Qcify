from pydantic import BaseModel, Field, validator
from typing import List, Optional, Union
from enum import Enum


class GateName(str, Enum):
    h = "h"
    x = "x"
    y = "y"
    z = "z"
    s = "s"
    sdg = "sdg"
    t = "t"
    tdg = "tdg"
    rx = "rx"
    ry = "ry"
    rz = "rz"
    cx = "cx"
    cz = "cz"
    swap = "swap"
    ccx = "ccx"
    measure = "measure"


class GateOperation(BaseModel):
    name: GateName
    qubits: List[int]
    params: Optional[List[float]] = None


class CircuitRequestA(BaseModel):
    framework: str = Field(default="qiskit")
    num_qubits: int = Field(..., ge=1, le=10)
    shots: int = Field(default=1024, ge=1, le=8192)
    gates: List[GateOperation]
    measure_all: bool = False

    @validator('framework')
    def validate_framework(cls, v):
        if v != "qiskit":
            raise ValueError('Only qiskit framework is currently supported')
        return v

    @validator('gates')
    def validate_gates(cls, v):
        # Additional gate-specific validations can be added here
        return v


class CircuitRequestB(BaseModel):
    framework: str = Field(default="qiskit")
    qasm: str
    shots: int = Field(default=1024, ge=1, le=8192)

    @validator('framework')
    def validate_framework(cls, v):
        if v != "qiskit":
            raise ValueError('Only qiskit framework is currently supported')
        return v


# Union type for the request body
CircuitRequest = Union[CircuitRequestA, CircuitRequestB]


class CircuitResponse(BaseModel):
    framework: str
    backend: str
    shots: int
    num_qubits: int
    counts: dict[str, int]
    probabilities: dict[str, float]
    statevector: Optional[List[dict]] = None
    circuit_ascii: str
    execution_time_ms: float