# Quantum Circuit Execution Backend Implementation Plan

## Current State Analysis
- Backend has basic FastAPI setup with CORS
- Routes exist for circuit and mascot (mascot commented out in main.py)
- circuit_data.py only has a name field (needs expansion)
- qiskit_runner.py is a stub
- requirements.txt has basic packages
- .env.example only has OPENAI_API_KEY
- No tests directory exists

## Implementation Steps

### 1. Configuration Updates
- Update core/config.py to support ALLOWED_ORIGINS, MAX_QUBITS, MAX_SHOTS from env
- Update .env.example with these variables
- Update main.py to use config for CORS origins

### 2. Schema Updates
- Expand circuit_data.py to support both request formats (A and B)
- Add validation for gates, qubits, shots, etc.

### 3. Service Implementation
- Implement qiskit_runner.py with actual Qiskit circuit execution
- Support both gate-based and QASM input
- Handle simulation with AerSimulator
- Generate required response format with counts, probabilities, statevector, circuit_ascii
- Validate inputs and raise appropriate HTTP exceptions

### 4. Route Implementation
- Update /api/circuit/execute to handle POST requests
- Add GET /api/frameworks endpoint
- Keep GET /health endpoint
- Register circuit router in main.py
- Comment out mascot router registration

### 5. Testing
- Create tests/test_circuit.py
- Implement tests for Bell state, single H, X gate, OpenQASM input, error cases
- Test validation for invalid gates, out-of-range qubits, shots too high
- Test pennylane/framework -> 501

### 6. Dependencies
- Pin versions in requirements.txt
- Install into active venv

### 7. Verification
- Run uvicorn with reload
- Test /docs endpoint
- Test Bell state execution via curl
- Add Backend API section to root README

## Files to Modify
- backend/app/main.py
- backend/app/core/config.py
- backend/app/schemas/circuit_data.py
- backend/app/services/qiskit_runner.py
- backend/app/api/routes/circuit.py
- backend/requirements.txt
- backend/.env.example
- backend/tests/test_circuit.py (new)
- Root README.md (add section)

## Key Requirements to Implement
- Framework validation (qiskit=available, others=501)
- Qubit range 1-10, shots 1-8192 (default 1024)
- Gate validation: h,x,y,z,s,sdg,t,tdg,rx,ry,rz,cx,cz,swap,ccx,measure
- Response format with counts, probabilities, statevector, circuit_ascii, execution_time_ms
- Little-endian bitstrings documentation
- Statevector null if num_qubits > 5
- Probabilities for ALL basis states (including zeros)
- Human-readable error responses (400/422, no 500s)