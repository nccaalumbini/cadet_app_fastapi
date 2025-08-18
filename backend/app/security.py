from datetime import datetime, timedelta, timezone
from typing import Optional
from passlib.context import CryptContext
from jose import jwt, JWTError
from .config import settings

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
ALGORITHM = "HS256"

# Hash a plain password
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

# Verify password against hashed version
def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

# Create JWT token with optional role & district
def create_access_token(subject: str, expires_minutes: int = None, role: str = None, district: str = None) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=expires_minutes or settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {
        "sub": subject,
        "exp": expire,
        "role": role,
        "district": district
    }
    return jwt.encode(to_encode, settings.JWT_SECRET, algorithm=ALGORITHM)

# Decode JWT token and extract subject
def decode_token(token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[ALGORITHM])
        return {
            "sub": payload.get("sub"),
            "role": payload.get("role"),
            "district": payload.get("district")
        }
    except JWTError:
        return None
