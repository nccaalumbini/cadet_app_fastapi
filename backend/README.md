Cadet App Backend (FastAPI + MySQL + JWT)

1) Create MySQL DB and user (see main README).
2) Copy .env.example -> .env and edit values.
3) Create venv, install deps:
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
4) Run:
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

API docs: http://localhost:8000/docs
