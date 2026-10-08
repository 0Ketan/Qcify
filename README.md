# 🚀 AI-Based Interactive Quantum Learning Platform (SIH Hackathon)

## 1. Project Overview & Vision

This platform is a **gamified, psychologically optimized web application** designed to teach quantum computing concepts like **qubits, superposition, and entanglement** in an engaging and practical way.

Our core teaching strategy is **Progressive Disclosure**: we intentionally hide complexity from absolute beginners so they can build intuition first, while still providing a powerful environment for intermediate and advanced learners who want deeper control.

## 2. Core Features & The User Journey

### 🤖 The AI Mascot
A specialized tutor that teaches through **storytelling, contextual hints, and real-world analogies** instead of overwhelming users with dense mathematics.

### 🌱 Newbie Track
- Advanced UI is initially locked to reduce cognitive overload.
- Analogy-first interactive simulations (including **3D CSS animations for superposition**) help users visualize abstract quantum ideas.
- Dopamine-driven progress loops use gamification and the **Endowed Progress Effect** to keep momentum high.

### 🧠 Intermediate Track
- Unlocked after passing a **Gateway Quiz**.
- Introduces guided algorithms and conceptual depth.
- Bridges learners from intuition-led content to structured, technical quantum workflows.

### 🧪 Advanced Track
- Full, unrestricted access to the drag-and-drop circuit builder sandbox.
- Custom Qiskit code execution.
- Complex algorithm experimentation and testing for power users.

## 3. Architecture & Tech Stack

```
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── CircuitBuilder/
│   │   │   ├── Gamification/
│   │   │   ├── MascotChat/
│   │   │   └── Shared/
│   │   ├── pages/
│   │   │   ├── Onboarding/
│   │   │   ├── NewbieJourney/
│   │   │   ├── Dashboard/
│   │   │   └── Sandbox/
│   │   ├── state/
│   │   │   └── userStore.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── .env.example
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── routes/
│   │   │       ├── circuit.py
│   │   │       └── mascot.py
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   └── llm_prompts.py
│   │   ├── schemas/
│   │   │   ├── circuit_data.py
│   │   │   └── chat_data.py
│   │   ├── services/
│   │   │   ├── qiskit_runner.py
│   │   │   └── llm_service.py
│   │   └── main.py
│   ├── requirements.txt
│   └── .env.example
└── README.md
```

### 🎨 Frontend
**React (Vite)** powers the responsive UI, user state management, gamification logic, and visual circuit-building interactions.

### ⚙️ Backend
**Python FastAPI** provides high-speed API routing and manages AI system prompts and backend orchestration.

### ⚛️ Quantum Engine
**Qiskit** and **Qiskit Aer** handle circuit transpilation and real-time simulation for interactive quantum experimentation.

## 4. Local Development Setup (Step-by-Step)

Run the frontend and backend in parallel using two terminals.

### Terminal 1 — Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Terminal 2 — Backend Setup

```bash
cd backend
python -m venv venv
```

Activate the environment:

**Mac/Linux**
```bash
source venv/bin/activate
```

**Windows**
```powershell
venv\Scripts\activate
```

Install dependencies and start the API server:

```bash
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## 5. Repository Structure & Team Workflow

### `frontend/src/`
Contains UI components (such as **CircuitBuilder** and **MascotChat**), React state (`userStore.js`), and gamified page views used across onboarding and learning tracks.

### `backend/app/`
Contains backend execution logic (including `qiskit_runner.py`), AI interaction services, and FastAPI route modules that power simulation and tutoring workflows.

## 6. Backend API

The backend provides a RESTful API for executing quantum circuits and managing framework information.

### Base URL
```
http://localhost:8000
```

### Endpoints

#### Health Check
```http
GET /circuit/health
```
Returns the health status of the backend service.

**Response:**
```json
{
  "status": "ok"
}
```

#### Available Frameworks
```http
GET /circuit/frameworks
```
Returns a list of supported quantum frameworks and their availability status.

**Response:**
```json
[
  {"id": "qiskit", "name": "Qiskit", "status": "available"},
  {"id": "pennylane", "name": "PennyLane", "status": "coming_soon"},
  {"id": "cirq", "name": "Cirq", "status": "coming_soon"},
  {"id": "qbraid", "name": "QBraid", "status": "coming_soon"}
]
```

#### Execute Quantum Circuit
```http
POST /circuit/execute
```
Executes a quantum circuit using either gate-based or QASM-based specification.

**Request Format (Gate-based - Option A):**
```json
{
  "framework": "qiskit",
  "num_qubits": 2,
  "shots": 1024,
  "gates": [
    {"name": "h", "qubits": [0]},
    {"name": "cx", "qubits": [0, 1]}
  ],
  "measure_all": true
}
```

**Request Format (QASM-based - Option B):**
```json
{
  "framework": "qiskit",
  "qasm": "OPENQASM 2.0;\ninclude \"qelib1.inc\";\nqreg q[2];\ncreg c[2];\nh q[0];\ncx q[0],q[1];\nmeasure q[0] -> c[0];\nmeasure q[1] -> c[1];",
  "shots": 1024
}
```

**Supported Gates:**
- Single-qubit: `h`, `x`, `y`, `z`, `s`, `sdg`, `t`, `tdg`, `rx`, `ry`, `rz`
- Two-qubit: `cx`, `cz`, `swap`
- Three-qubit: `ccx`
- Measurement: `measure`

**Validation Rules:**
- `framework` must be `"qiskit"` (other frameworks return HTTP 501)
- `num_qubits`: 1-10 (inclusive)
- `shots`: 1-8192 (inclusive, default 1024)
- Gate parameters validated for correct qubit counts and parameter requirements

**Response Format:**
```json
{
  "framework": "qiskit",
  "backend": "aer_simulator",
  "shots": 1024,
  "num_qubits": 2,
  "counts": {
    "00": 510,
    "11": 514
  },
  "probabilities": {
    "00": 0.498,
    "01": 0.0,
    "10": 0.0,
    "11": 0.502
  },
  "statevector": [
    {
      "state": "00",
      "real": 0.707,
      "imag": 0.0,
      "probability": 0.5
    },
    {
      "state": "11",
      "real": 0.707,
      "imag": 0.0,
      "probability": 0.5
    }
  ],
  "circuit_ascii": "     ┌───┐ ░ ┌─┐ \\nq_0: ┤ H ├─■─░─╫─ \\n     └───┘ ░ └╨─┘ \\nq_1: ─────╫─╨─╨─╨─ \\n       ┌─┴─┐ ░  ║  \\n└╨─┘q_2: ┤ X ├─╨─╨─╨─ \\n",
  "execution_time_ms": 12.5
}
```

**Response Details:**
- `probabilities`: Includes ALL basis states (including zero probabilities) for complete bar chart rendering
- `statevector`: Returns null if `num_qubits > 5` (due to exponential complexity)
- `counts`: Raw measurement results from the quantum simulator
- `little-endian bitstring format`: Qubit 0 is represented as the rightmost bit in the bitstring (e.g., "01" means qubit 0=1, qubit 1=0)
- `execution_time_ms`: Time taken to execute the circuit in milliseconds

**Error Responses:**
- `400 Bad Request`: Invalid gate name, out-of-range qubit, invalid parameter count
- `422 Unprocessable Entity`: Validation failed (e.g., shots > 8192)
- `501 Not Implemented`: Unsupported framework (pennylane, cirq, qbraid)
- `500 Internal Server Error`: Unexpected execution error

### Example: Bell State Execution

**Request:**
```http
POST /circuit/execute
Content-Type: application/json

{
  "framework": "qiskit",
  "num_qubits": 2,
  "shots": 1024,
  "gates": [
    {"name": "h", "qubits": [0]},
    {"name": "cx", "qubits": [0, 1]}
  ],
  "measure_all": true
}
```

**Response:**
```json
{
  "framework": "qiskit",
  "backend": "aer_simulator",
  "shots": 1024,
  "num_qubits": 2,
  "counts": {
    "00": 510,
    "11": 514
  },
  "probabilities": {
    "00": 0.498,
    "01": 0.0,
    "10": 0.0,
    "11": 0.502
  },
  "statevector": [
    {
      "state": "00",
      "real": 0.7071067811865476,
      "imag": 0.0,
      "probability": 0.5
    },
    {
      "state": "11",
      "real": 0.7071067811865476,
      "imag": 0.0,
      "probability": 0.5
    }
  ],
  "circuit_ascii": "     ┌───┐ ░ ┌─┐ \\nq_0: ┤ H ├─■─░─╫─ \\n     └───┘ ░ └╨─┘ \\nq_1: ─────╫─╨─╨─╨─ \\n       ┌─┴─┐ ░  ║  \\n└╨─┘q_2: ┤ X ├─╨─╨─╨─ \\n",
  "execution_time_ms": 12.5
}
```