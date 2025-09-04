from sqlalchemy import Column, Integer, String, DateTime, func, UniqueConstraint
from app.core.database import Base
from sqlalchemy.orm import relationship 

class User(Base):
    """
    User model for NCCAA Cadet Management System.
    Supports province-level and district-level admin roles.
    """
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    cadet_number = Column(String(50), nullable=False, unique=True, index=True)
    username = Column(String(50), nullable=False, unique=True, index=True)
    email = Column(String(255), nullable=False, unique=True, index=True)
    contact_number = Column(String(30), nullable=True)
    address = Column(String(255), nullable=True)
    district = Column(String(100), nullable=True)  # Stores the district name
    role = Column(String(50), nullable=False, default="user")  # user, district_admin, province_admin
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        UniqueConstraint('cadet_number', name='uq_users_cadet_number'),
        UniqueConstraint('username', name='uq_users_username'),
        UniqueConstraint('email', name='uq_users_email'),
    )
    # Relationship with school
    #school = relationship("School", backref="coordinators")
