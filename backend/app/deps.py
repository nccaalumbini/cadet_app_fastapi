from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError
from sqlalchemy.orm import Session
from .security import decode_access_token
from .db import get_db
from . import models

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def get_current_user(token: str = Depends(oauth2_scheme),
                    db: Session = Depends(get_db)) -> models.User:
    """
    Extract user from JWT token and return DB user object.
    Raises 401 if invalid or expired, 404 if user not found.
    """
    try:
        payload = decode_access_token(token)
        if not payload:
            raise HTTPException(status_code=401, detail="Invalid or expired token")
        user_id: str = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token payload")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    # fetch directly from DB (no get_user_by_id helper needed)
    user = db.get(models.User, int(user_id))
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user
