import time
from typing import Dict, Any, Union
import numpy as np
import sys

# Import Qiskit components
try:
    from qiskit import QuantumCircuit
    from qiskit_aer import Aer
    from qiskit.visualization import circuit_drawer
    from qiskit.qasm2 import load as qasm2_load
    from qiskit.qasm3 import loads as qasm3_loads
    from qiskit.quantum_info import Statevector
    HAS_QISKIT = True
    print("DEBUG: Qiskit imports successful", file=sys.stderr)
except Exception as e:
    HAS_QISKIT = False
    print(f"DEBUG: Qiskit import error: {e}", file=sys.stderr)
    import traceback
    traceback.print_exc()

from app.schemas.circuit_data import CircuitRequestA, CircuitRequestB, CircuitResponse


def run_circuit(circuit_data: Union[CircuitRequestA, CircuitRequestB]) -> Dict[str, Any]:
    """Execute a quantum circuit using Qiskit Aer simulator."""
    if not HAS_QISKIT:
        raise RuntimeError("Qiskit is not available")

    start_time = time.time()

    # Build and run circuits
    # Unmeasured circuit (no measurements) – for statevector
    # Measured circuit – for counts
    if isinstance(circuit_data, CircuitRequestA):
        qc = _build_circuit_from_gates(circuit_data)
        # For counts, ensure measurements are added if absent
        measured_qc = qc.copy()
        if measured_qc.num_clbits == 0 and getattr(circuit_data, "measure_all", False):
            measured_qc.measure_all()
    else:
        qc = _build_circuit_from_qasm(circuit_data)
        measured_qc = qc.copy()
        # Removed any measurement gates for counts
        if measured_qc.num_clbits == 0:
            # QASM circuit may already have measurements
            pass

    simulator = Aer.get_backend("aer_simulator")

    # Run measurement circuit
    try:
        job = simulator.run(measured_qc, shots=circuit_data.shots)
        result = job.result()
        counts = result.get_counts(measured_qc) if measured_qc.num_clbits > 0 else {}
    except Exception as e:
        raise RuntimeError(f"Simulation error: {e}")

    total_shots = sum(counts.values())
    num_states = 2 ** circuit_data.num_qubits
    probabilities: Dict[str, float] = {}
    for i in range(num_states):
        bits = format(i, f"0{circuit_data.num_qubits}b")[::-1]  # little‑endian
        probabilities[bits] = counts.get(bits, 0) / total_shots if total_shots else 0.0

    # Statevector from noiseless simulation
    statevector: list | None = None
    if circuit_data.num_qubits <= 5:
        try:
            # If qc already has measurements, remove them for statevector run
            sv_qc = qc.copy()
            if sv_qc.num_clbits > 0:
                # Remove all measurement operations
                sv_qc.remove_final_measurements(inplace=True)
            sv = Statevector(sv_qc)
            statevector = []
            for idx, amp in enumerate(sv.data):
                prob = abs(amp) ** 2
                if prob > 1e-9:
                    bits = format(idx, f"0{circuit_data.num_qubits}b")[::-1]
                    statevector.append({
                        "state": bits,
                        "real": float(np.real(amp)),
                        "imag": float(np.imag(amp)),
                        "probability": float(prob),
                    })
        except Exception as e:
            print(f"DEBUG: Statevector calculation failed: {e}", file=sys.stderr)
            statevector = None

    # Circuit ASCII diagram
    try:
        circuit_ascii = str(qc.draw(output="text"))
    except Exception as e:
        print(f"DEBUG: Circuit drawing failed: {e}", file=sys.stderr)
        circuit_ascii = f"Qiskit circuit with {circuit_data.num_qubits} qubits"

    execution_time_ms = (time.time() - start_time) * 1000

    return {
        "framework": circuit_data.framework,
        "backend": "aer_simulator",
        "shots": circuit_data.shots,
        "num_qubits": circuit_data.num_qubits,
        "counts": counts,
        "probabilities": probabilities,
        "statevector": statevector,
        "circuit_ascii": circuit_ascii,
        "execution_time_ms": round(execution_time_ms, 2),
    }


# Helper functions ---------------------------------------------

def _build_circuit_from_gates(request: CircuitRequestA) -> QuantumCircuit:
    if request.num_qubits < 1 or request.num_qubits > 10:
        raise ValueError("num_qubits must be 1-10")
    qc = QuantumCircuit(request.num_qubits)
    for op in request.gates:
        _apply_gate(qc, op)
    if request.measure_all:
        qc.measure_all()
    return qc


def _build_circuit_from_qasm(request: CircuitRequestB) -> QuantumCircuit:
    try:
        circuit = qasm2_load(request.qasm)
    except Exception:
        circuit = qasm3_loads(request.qasm)
    if circuit.num_qubits < 1 or circuit.num_qubits > 10:
        raise ValueError("num_qubits must be 1-10")
    request.num_qubits = circuit.num_qubits
    return circuit


def _apply_gate(qc: QuantumCircuit, gate_op: GateOperation) -> None:
    name = gate_op.name
    qubits = gate_op.qubits
    params = gate_op.params or []
    for q in qubits:
        if q < 0 or q >= qc.num_qubits:
            raise ValueError(f"Qubit {q} out of range")
    if name in ["rx", "ry", "rz"] and len(params) != 1:
        raise ValueError(f"{name} requires 1 param")
    if name == "h":
        qc.h(qubits[0])
    elif name == "x":
        qc.x(qubits[0])
    elif name == "y":
        qc.y(qubits[0])
    elif name == "z":
        qc.z(qubits[0])
    elif name == "s":
        qc.s(qubits[0])
    elif name == "sdg":
        qc.sdg(qubits[0])
    elif name == "t":
        qc.t(qubits[0])
    elif name == "tdg":
        qc.tdg(qubits[0])
    elif name == "rx":
        qc.rx(params[0], qubits[0])
    elif name == "ry":
        qc.ry(params[0], qubits[0])
    elif name == "rz":
        qc.rz(params[0], qubits[0])
    elif name == "cx":
        qc.cx(qubits[0], qubits[1])
    elif name == "cz":
        qc.cz(qubits[0], qubits[1])
    elif name == "swap":
        qc.swap(qubits[0], qubits[1])
    elif name == "ccx":
        qc.ccx(qubits[0], qubits[1], qubits[2])
    else:
        raise ValueError(f"Unsupported gate: {name}")
