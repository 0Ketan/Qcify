import time
import math
import cmath
import random
from typing import Dict, List, Tuple
from app.schemas.circuit_data import CircuitRequest, CircuitResponse, GateOperation, BlochVector

# Standard Single-Qubit Matrices (complex)
GATE_MATRICES = {
    "I": [[1, 0], [0, 1]],
    "X": [[0, 1], [1, 0]],
    "Y": [[0, -1j], [1j, 0]],
    "Z": [[1, 0], [0, -1]],
    "H": [[1/math.sqrt(2), 1/math.sqrt(2)], [1/math.sqrt(2), -1/math.sqrt(2)]],
    "S": [[1, 0], [0, 1j]],
    "T": [[1, 0], [0, cmath.exp(1j * math.pi / 4)]],
}

def kron(A, B):
    """Kronecker tensor product of two 2D matrices."""
    return [[a * b for b in B_row for a in A_row] for A_row in A for B_row in B]

def mat_vec_mult(M, v):
    """Matrix-vector multiplication."""
    n = len(v)
    res = [0j] * n
    for i in range(n):
        s = 0j
        for j in range(n):
            s += M[i][j] * v[j]
        res[i] = s
    return res

class QuantumSimulatorService:
    """
    Quantum simulation service supporting Qiskit if available,
    with an exact analytical matrix/statevector fallback engine.
    """

    def __init__(self):
        self.has_qiskit = False
        try:
            import qiskit
            from qiskit import QuantumCircuit
            from qiskit.quantum_info import Statevector
            self.has_qiskit = True
        except ImportError:
            self.has_qiskit = False

    def simulate(self, request: CircuitRequest) -> CircuitResponse:
        start_time = time.time()
        
        # Sort gates by step to preserve chronological application
        sorted_gates = sorted(request.gates, key=lambda g: g.step)

        if self.has_qiskit:
            try:
                return self._simulate_with_qiskit(request, sorted_gates, start_time)
            except Exception as e:
                # Fallback to analytical engine on error
                return self._simulate_with_matrix_engine(request, sorted_gates, start_time, fallback_note=str(e))
        else:
            return self._simulate_with_matrix_engine(request, sorted_gates, start_time)

    def _simulate_with_qiskit(self, request: CircuitRequest, gates: List[GateOperation], start_time: float) -> CircuitResponse:
        from qiskit import QuantumCircuit
        from qiskit.quantum_info import Statevector
        
        qc = QuantumCircuit(request.num_qubits)
        
        for g in gates:
            name = g.name.upper()
            target = g.target
            control = g.control
            
            if name == "H":
                qc.h(target)
            elif name == "X":
                qc.x(target)
            elif name == "Y":
                qc.y(target)
            elif name == "Z":
                qc.z(target)
            elif name == "S":
                qc.s(target)
            elif name == "T":
                qc.t(target)
            elif name in ("CNOT", "CX") and control is not None:
                qc.cx(control, target)
            elif name == "SWAP" and control is not None:
                qc.swap(control, target)

        sv = Statevector.from_instruction(qc)
        prob_dict = sv.probabilities_dict()
        
        # Normalize and format probabilities
        probs = {k: round(float(v), 4) for k, v in prob_dict.items()}
        
        # Simulated measurement counts
        counts = {}
        for bitstring, p in probs.items():
            if p > 0:
                counts[bitstring] = int(p * request.shots)
        
        statevec_list = [{"real": round(float(c.real), 4), "imag": round(float(c.imag), 4)} for c in sv.data]
        
        bloch_vectors = self._calculate_bloch_vectors(sv.data, request.num_qubits)
        elapsed_ms = (time.time() - start_time) * 1000

        return CircuitResponse(
            success=True,
            num_qubits=request.num_qubits,
            depth=qc.depth(),
            probabilities=probs,
            counts=counts,
            statevector=statevec_list,
            bloch_vectors=bloch_vectors,
            execution_time_ms=round(elapsed_ms, 2),
            backend_used="Qiskit Aer Simulator (native)",
            qasm_str=qc.qasm() if hasattr(qc, "qasm") else None,
            message="Circuit simulated successfully on Qiskit"
        )

    def _simulate_with_matrix_engine(self, request: CircuitRequest, gates: List[GateOperation], start_time: float, fallback_note: str = None) -> CircuitResponse:
        """
        Pure Python exact statevector simulation for 1-5 qubits.
        """
        n = request.num_qubits
        dim = 2 ** n
        
        # Initial state |0...0⟩
        state = [0j] * dim
        state[0] = 1.0 + 0j
        
        for g in gates:
            name = g.name.upper()
            target = g.target
            control = g.control
            
            if name in ("CNOT", "CX") and control is not None:
                # 2-qubit CNOT gate on statevector
                new_state = [0j] * dim
                for idx in range(dim):
                    c_bit = (idx >> (n - 1 - control)) & 1
                    t_bit = (idx >> (n - 1 - target)) & 1
                    if c_bit == 1:
                        # Flip target bit
                        flipped_idx = idx ^ (1 << (n - 1 - target))
                        new_state[flipped_idx] += state[idx]
                    else:
                        new_state[idx] += state[idx]
                state = new_state
            elif name == "SWAP" and control is not None:
                new_state = [0j] * dim
                for idx in range(dim):
                    b1 = (idx >> (n - 1 - control)) & 1
                    b2 = (idx >> (n - 1 - target)) & 1
                    if b1 != b2:
                        swapped_idx = idx ^ ((1 << (n - 1 - control)) | (1 << (n - 1 - target)))
                        new_state[swapped_idx] += state[idx]
                    else:
                        new_state[idx] += state[idx]
                state = new_state
            elif name in GATE_MATRICES:
                # 1-qubit gate via Kronecker product
                u = GATE_MATRICES[name]
                op = [[1]]
                for q in range(n):
                    if q == target:
                        op = kron(op, u)
                    else:
                        op = kron(op, GATE_MATRICES["I"])
                state = mat_vec_mult(op, state)

        # Probabilities
        probs = {}
        for idx, amp in enumerate(state):
            bitstring = bin(idx)[2:].zfill(n)
            p = float(amp.real**2 + amp.imag**2)
            if p > 0.0001:
                probs[bitstring] = round(p, 4)
                
        # Simulate shots sampling
        counts = {}
        outcomes = list(probs.keys())
        weights = list(probs.values())
        if outcomes and sum(weights) > 0:
            samples = random.choices(outcomes, weights=weights, k=request.shots)
            for s in samples:
                counts[s] = counts.get(s, 0) + 1

        statevec_list = [{"real": round(float(c.real), 4), "imag": round(float(c.imag), 4)} for c in state]
        bloch_vectors = self._calculate_bloch_vectors(state, n)
        elapsed_ms = (time.time() - start_time) * 1000

        backend_name = "Analytical Quantum Statevector Engine"
        if fallback_note:
            backend_name += f" (Qiskit fallback: {fallback_note})"

        return CircuitResponse(
            success=True,
            num_qubits=n,
            depth=len(gates),
            probabilities=probs,
            counts=counts,
            statevector=statevec_list,
            bloch_vectors=bloch_vectors,
            execution_time_ms=round(elapsed_ms, 2),
            backend_used=backend_name,
            message="Circuit simulated successfully"
        )

    def _calculate_bloch_vectors(self, state, n: int) -> List[BlochVector]:
        """Compute single-qubit Bloch vector expectation values (⟨X⟩, ⟨Y⟩, ⟨Z⟩)."""
        bloch_list = []
        for q in range(n):
            # Compute reduced single-qubit density matrix elements
            rho00 = 0.0
            rho11 = 0.0
            rho01 = 0j
            for idx in range(len(state)):
                val = state[idx]
                is_one = (idx >> (n - 1 - q)) & 1
                if is_one == 0:
                    rho00 += abs(val)**2
                    partner_idx = idx | (1 << (n - 1 - q))
                    rho01 += val * (state[partner_idx].conjugate())
                else:
                    rho11 += abs(val)**2
            
            x = round(float(2 * rho01.real), 3)
            y = round(float(-2 * rho01.imag), 3)
            z = round(float(rho00 - rho11), 3)
            bloch_list.append(BlochVector(qubit=q, x=x, y=y, z=z))
        return bloch_list

simulator_service = QuantumSimulatorService()
