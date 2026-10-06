from app.schemas.circuit_data import CircuitData


def run_circuit(circuit_data: CircuitData) -> dict:
    return {"status": "pending", "circuit": circuit_data.name}
