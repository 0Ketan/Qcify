import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health_endpoint():
    """Test the health endpoint."""
    response = client.get("/circuit/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_frameworks_endpoint():
    """Test the frameworks endpoint."""
    response = client.get("/circuit/frameworks")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 4
    assert data[0]["id"] == "qiskit"
    assert data[0]["status"] == "available"
    assert data[1]["id"] == "pennylane"
    assert data[1]["status"] == "coming_soon"


def test_bell_state_gate_based():
    """Test Bell state creation using gate-based input."""
    payload = {
        "framework": "qiskit",
        "num_qubits": 2,
        "shots": 1024,
        "gates": [
            {"name": "h", "qubits": [0]},
            {"name": "cx", "qubits": [0, 1]}
        ],
        "measure_all": True
    }
    response = client.post("/circuit/execute", json=payload)
    assert response.status_code == 200
    data = response.json()

    # Check statevector
    sv = data["statevector"]
    assert sv is not None
    assert len(sv) == 2
    for item in sv:
        assert item["probability"] > 0.49 and item["probability"] < 0.51
        assert item["real"] > 0.70 and item["real"] < 0.72

    # Circuit ASCII is not the placeholder
    ascii_art = data["circuit_ascii"]
    assert ascii_art != "Qiskit circuit with 2 qubits"
    # Should contain H gate representation
    assert "H" in ascii_art


def test_single_hadamard():
    payload = {
        "framework": "qiskit",
        "num_qubits": 1,
        "shots": 500,
        "gates": [
            {"name": "h", "qubits": [0]}
        ],
        "measure_all": True
    }
    response = client.post("/circuit/execute", json=payload)
    assert response.status_code == 200
    sv = response.json()["statevector"]
    assert sv is not None
    assert len(sv) == 2
    for item in sv:
        assert abs(item["real"] - 0.7071) < 0.01
        assert item["probability"] > 0.49 and item["probability"] < 0.51


def test_statevector_null_for_large_qubits():
    payload = {
        "framework": "qiskit",
        "num_qubits": 6,
        "shots": 100,
        "gates": [
            {"name": "h", "qubits": [0]}
        ],
        "measure_all": True
    }
    response = client.post("/circuit/execute", json=payload)
    assert response.status_code == 200
    assert response.json()["statevector"] is None
