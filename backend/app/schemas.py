from pydantic import BaseModel, EmailStr, Field
from typing import Optional

# For creating a new user
class UserCreate(BaseModel):
    cadet_number: str = Field(..., min_length=5, max_length=15)
    username: str = Field(..., min_length=5, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=6)
    contact_number: Optional[str] = None
    address: Optional[str] = None
    district: Optional[str] = None  # optional, auto-set for district_admin
    role: Optional[str] = "user"   # user / district_admin / province_admin

# For outputting user info
class UserOut(BaseModel):
    id: int
    cadet_number: str
    username: str
    email: EmailStr
    contact_number: Optional[str]
    address: Optional[str]
    district: Optional[str]
    role: str

    class Config:
        orm_mode = True

# For login
class LoginIn(BaseModel):
    email: Optional[EmailStr] = None
    username: Optional[str] = None
    password: str

# JWT token response
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

# Generic message response
class Message(BaseModel):
    message: str
