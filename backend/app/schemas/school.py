from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional, List
from datetime import date, datetime

# -------------------
# TrainingSession Schemas
# -------------------

class TrainingSessionBase(BaseModel):
    ncc_batch: str
    start_date: date
    passout_date: Optional[date] = None
    division: str  # junior/senior

class TrainingSessionCreate(TrainingSessionBase):
    pass

class TrainingSession(TrainingSessionBase):
    id: int
    school_id: int
    model_config = ConfigDict(from_attributes=True)  # replaces orm_mode = True


# -------------------
# School Schemas
# -------------------

class SchoolBase(BaseModel):
    name: str
    district: str
    municipality: str
    ward_number: int
    area_name: Optional[str] = None
    official_email: Optional[EmailStr] = None
    phone_number: str
    website: Optional[str] = None
    principal_name: str
    principal_contact: str
    teacher_name: Optional[str] = None
    teacher_contact: Optional[str] = None
    notes: Optional[str] = None

class SchoolCreate(SchoolBase):
    training_sessions: List[TrainingSessionCreate] = []

# ✅ Improvement: fields optional for partial update
class SchoolUpdate(BaseModel):
    name: Optional[str] = None
    district: Optional[str] = None
    municipality: Optional[str] = None
    ward_number: Optional[int] = None
    area_name: Optional[str] = None
    official_email: Optional[EmailStr] = None
    phone_number: Optional[str] = None
    website: Optional[str] = None
    principal_name: Optional[str] = None
    principal_contact: Optional[str] = None
    teacher_name: Optional[str] = None
    teacher_contact: Optional[str] = None
    notes: Optional[str] = None
    training_sessions: Optional[List[TrainingSessionCreate]] = None

class School(SchoolBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime
    training_sessions: List[TrainingSession] = []
    
    model_config = ConfigDict(from_attributes=True)

class SchoolListResponse(BaseModel):
    items: List[School]
    total: int
