from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..db import get_db, Base, engine
from .. import models, schemas
from ..security import verify_password, create_access_token

# Ensure tables exist
Base.metadata.create_all(bind=engine)

router = APIRouter()

@router.post("/login", response_model=schemas.Token)
def login(payload: schemas.LoginIn, db: Session = Depends(get_db)):
    """
    Login endpoint.
    Returns JWT token with role and district info.
    """
    if not payload.email and not payload.username:
        raise HTTPException(status_code=400, detail="Provide email or username")

    query = db.query(models.User)
    user = None
    if payload.email:
        user = query.filter(models.User.email == payload.email).first()
    elif payload.username:
        user = query.filter(models.User.username == payload.username).first()

    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    # Include role and district in JWT
    token = create_access_token(
        subject=str(user.id),
        role=user.role,
        district=user.district
    )
    return {"access_token": token, "token_type": "bearer"}
