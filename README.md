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
