from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import engine, Base
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, users, schools  # Import schools


app = FastAPI(title="NCCAA API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(users.router, prefix="/users", tags=["users"])
app.include_router(schools.router, prefix="/schools", tags=["schools"])  # Add schools router

@app.get("/", tags=["health"])
def root():
    return {"status": "ok", "message": "NCCAA API is running"}