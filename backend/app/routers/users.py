from fastapi import APIRouter, Depends, HTTPException, Header, status
from sqlalchemy.orm import Session
from ..db import get_db
from .. import models, schemas
from ..security import hash_password, decode_token

router = APIRouter()

def get_current_user(authorization: str = Header(None), db: Session = Depends(get_db)) -> models.User:
    """
    Get current user from Bearer token.
    Raises 401 if token missing or invalid.
    """
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid Authorization header")
    token = authorization.split(" ", 1)[1]
    payload = decode_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    user = db.get(models.User, int(payload["sub"]))
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user

@router.post("/create", response_model=schemas.UserOut)
def create_user(payload: schemas.UserCreate, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Province admin can create users for any district.
    District admin can create users only for their district.
    """
    if current_user.role not in ["province_admin", "district_admin"]:
        raise HTTPException(status_code=403, detail="Unauthorized to create users")

    # District admin can only create users in their district
    if current_user.role == "district_admin":
        if payload.district and payload.district.lower() != current_user.district.lower():
            raise HTTPException(status_code=403, detail="Cannot create user outside your district")
        payload.district = current_user.district

    # Check uniqueness
    if db.query(models.User).filter(models.User.email == payload.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    if db.query(models.User).filter(models.User.username == payload.username).first():
        raise HTTPException(status_code=400, detail="Username already taken")
    if db.query(models.User).filter(models.User.cadet_number == payload.cadet_number).first():
        raise HTTPException(status_code=400, detail="Cadet number already registered")

    # Create user
    user = models.User(
        cadet_number=payload.cadet_number,
        username=payload.username,
        email=payload.email,
        contact_number=payload.contact_number,
        address=payload.address,
        district=payload.district,
        role=payload.role,
        password_hash=hash_password(payload.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@router.get("/me", response_model=schemas.UserOut)
def me(user: models.User = Depends(get_current_user)):
    """
    Returns current user's profile.
    """
    return user
