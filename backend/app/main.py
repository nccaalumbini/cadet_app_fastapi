from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import auth, users

app = FastAPI(title="Cadet App API")

# Allow requests from your frontend
origins = [
    "http://localhost:3000",
    "http://0.0.0.0:3000",
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", tags=["health"])
def root():
    return {"status": "ok"}

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(users.router, prefix="/users", tags=["users"])
