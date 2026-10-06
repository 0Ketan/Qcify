# Qcify

Monorepo scaffold for an AI-Based Interactive Quantum Learning Platform.

## Project Structure

- `frontend/`: React + Vite client
- `backend/`: FastAPI server

## Run Frontend (Vite)

```bash
cd frontend
npm install
npm run dev
```

## Run Backend (Uvicorn)

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Run Both Concurrently

Open two terminals:

1. Start frontend from `frontend/` with `npm run dev`
2. Start backend from `backend/` with `uvicorn app.main:app --reload`
