from sqlalchemy import Column, Integer, String, Date, DateTime, Text, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class School(Base):
    __tablename__ = "schools"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), unique=True, nullable=False, index=True)
    district = Column(String(100), nullable=False)
    municipality = Column(String(100), nullable=False)
    ward_number = Column(Integer, nullable=False)
    area_name = Column(String(100))
    official_email = Column(String(255))
    phone_number = Column(String(20), nullable=False)
    website = Column(String(255))
    principal_name = Column(String(100), nullable=False)
    principal_contact = Column(String(20), nullable=False)
    teacher_name = Column(String(100))
    teacher_contact = Column(String(20))
    notes = Column(Text)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relationship with training sessions
    training_sessions = relationship("TrainingSession", back_populates="school")

class TrainingSession(Base):
    __tablename__ = "training_sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    school_id = Column(Integer, ForeignKey("schools.id"))
    ncc_batch = Column(String(100), nullable=False)
    start_date = Column(Date, nullable=False)
    passout_date = Column(Date)
    division = Column(String(10), nullable=False)  # junior/senior
    
    # Relationship with school
    school = relationship("School", back_populates="training_sessions")
