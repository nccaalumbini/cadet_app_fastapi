from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..db import get_db
from .. import models, schemas
from ..security import hash_password
from ..deps import get_current_user  # use from deps.py

router = APIRouter()

@router.post("/create", response_model=schemas.UserOut)
def create_user(
    payload: schemas.UserCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Province admin can create users for any district.
    District admin can create users only for their district.
    """
    if current_user.role not in ["province_admin", "district_admin"]:
        raise HTTPException(status_code=403, detail="Unauthorized to create users")

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

@router.get("/me")
def read_users_me(current_user: models.User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "username": current_user.username,
        "role": current_user.role,
        "district": current_user.district,
    }
