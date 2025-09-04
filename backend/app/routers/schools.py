from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import Base, engine, get_db
from pydantic import BaseModel
from typing import List
from app.models import school as models

from app.models.user import User
from app.dependencies.deps import get_current_user
from sqlalchemy.orm import joinedload
from fastapi import APIRouter, Depends, HTTPException, status
from app import schemas
from app.core.database import get_db
from app.schemas.school import (
    School as SchoolSchema,
    SchoolCreate,
    SchoolUpdate,
    SchoolListResponse
)

__all__ = ["get_current_user"]

router = APIRouter(prefix="/schools", tags=["schools"])

@router.get("/stats/")
def get_school_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    total_schools = db.query(models.School).count()
    active_schools = db.query(models.School).filter(models.School.is_active == True).count()

    # Count training sessions and multiply by Cadets per session (30)
    total_sessions = db.query(models.TrainingSession).count()
    total_cadets = total_sessions * 30

    districts_covered = db.query(models.School.district).distinct().count()

    return {
        "total_schools": total_schools,
        "active_schools": active_schools,
        "total_cadets": total_cadets,
        "districts_covered": districts_covered
    }
    
    
@router.post("/", response_model=SchoolSchema)
def create_school(
    school_data: SchoolCreate,  # <-- Fix: use SchoolCreate, not SchoolSchema
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    print("Received school creation request:", school_data.dict())  # Debug log

    # Check permissions
    if current_user.role not in ["admin", "committee_member"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to create schools"
        )
    
    # Check if school name already exists
    existing_school = db.query(models.School).filter(
        models.School.name == school_data.name
    ).first()
    
    if existing_school:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="School with this name already exists"
        )
    
    # Create school
    db_school = models.School(
        **school_data.dict(exclude={"training_sessions"})
    )
    db.add(db_school)
    db.flush()  # Flush to get the ID but don't commit yet
    
    # Add training sessions
    for session_data in school_data.training_sessions:
        db_session = models.TrainingSession(
            **session_data.dict(),
            school_id=db_school.id
        )
        db.add(db_session)
    
    db.commit()
    db.refresh(db_school)
    
    return db_school


@router.get("/", response_model=SchoolListResponse)
def get_schools(
    skip: int = 0,
    limit: int = 100,
    district: Optional[str] = None,
    is_active: Optional[bool] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(models.School).options(joinedload(models.School.training_sessions))

    # Role-based filtering
    if current_user.role == "district_admin" and current_user.district:
        query = query.filter(models.School.district == current_user.district)
    elif current_user.role == "school_coordinator" and current_user.school_id:
        query = query.filter(models.School.id == current_user.school_id)
    # Admin has access to all schools

    if district:
        query = query.filter(models.School.district == district)
    if is_active is not None:
        query = query.filter(models.School.is_active == is_active)

    total = query.count()
    schools = query.offset(skip).limit(limit).all()

    return {"items": schools, "total": total}


router = APIRouter(prefix="/schools", tags=["schools"])


@router.get("/{school_id}", response_model=SchoolSchema)
def get_school(
    school_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_school = (
        db.query(models.School)
        .options(joinedload(models.School.training_sessions))
        .filter(models.School.id == school_id)
        .first()
    )

    if not db_school:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="School not found"
        )
    if current_user.role == "admin":
        # Admin can access any school
        return db_school
   
    if (current_user.role == "district_admin" and 
        db_school.district != current_user.district):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this school"
        )
    
    if (current_user.role == "school_coordinator" and 
        db_school.id != current_user.school_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this school"
        )
    
    return db_school

@router.put("/{school_id}", response_model=SchoolSchema)
def update_school(
    school_id: int,
    school_data: SchoolUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Check permissions
    if current_user.role not in ["admin", "committee_member"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update schools"
        )
    
    db_school = db.query(models.School).filter(models.School.id == school_id).first()
    
    if not db_school:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="School not found"
        )
    
    # Update school fields
    update_data = school_data.dict(exclude={"training_sessions"}, exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_school, field, value)
    
    # Handle training sessions - this is a simplified approach
    # In production, you might want a more sophisticated way to update sessions
    if school_data.training_sessions:
        # Delete existing sessions
        db.query(models.TrainingSession).filter(
            models.TrainingSession.school_id == school_id
        ).delete()
        
        # Add new sessions
        for session_data in school_data.training_sessions:
            db_session = models.TrainingSession(
                **session_data.dict(),
                school_id=school_id
            )
            db.add(db_session)
    
    db.commit()
    db.refresh(db_school)
    
    return db_school

@router.delete("/{school_id}")
def delete_school(
    school_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Only admin can delete schools
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admin can delete schools"
        )
    
    db_school = db.query(models.School).filter(models.School.id == school_id).first()
    
    if not db_school:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="School not found"
        )
    
    # Soft delete
    db_school.is_active = False
    db.commit()
    
    return {"message": "School deleted successfully"}