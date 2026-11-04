from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from app.core.database import get_db
from app.core.deps import get_current_user, require_role
from app.models.provider_profile import ProviderProfile
from app.models.technician_profile import TechnicianProfile
from app.models.user import User

router = APIRouter(prefix="/providers", tags=["Providers"])


class ProviderProfileCreate(BaseModel):
    business_name: str
    business_description: Optional[str] = None
    years_experience: int = 0
    service_area: Optional[str] = None
    gst_number: Optional[str] = None


class ProviderProfileUpdate(BaseModel):
    business_name: Optional[str] = None
    business_description: Optional[str] = None
    years_experience: Optional[int] = None
    service_area: Optional[str] = None
    is_available: Optional[bool] = None
    logo_url: Optional[str] = None


class ProviderProfileResponse(BaseModel):
    id: int
    user_id: int
    business_name: str
    business_description: Optional[str] = None
    logo_url: Optional[str] = None
    years_experience: int = 0
    service_area: Optional[str] = None
    is_verified: bool
    is_available: bool
    rating: float
    total_reviews: int
    total_bookings: int

    model_config = {"from_attributes": True}


class TechnicianCreate(BaseModel):
    email: str
    full_name: str
    password: str
    phone: Optional[str] = None
    specialization: Optional[str] = None
    bio: Optional[str] = None


class TechnicianResponse(BaseModel):
    id: int
    user_id: int
    full_name: Optional[str] = None
    email: Optional[str] = None
    specialization: Optional[str] = None
    is_available: bool
    rating: float
    total_jobs: int

    model_config = {"from_attributes": True}


@router.post("/profile", response_model=ProviderProfileResponse, status_code=201)
def create_provider_profile(
    data: ProviderProfileCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_role("provider"))
):
    existing = db.query(ProviderProfile).filter(ProviderProfile.user_id == current_user.id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Provider profile already exists")
    profile = ProviderProfile(user_id=current_user.id, **data.model_dump())
    db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile


@router.get("/profile/me", response_model=ProviderProfileResponse)
def get_my_provider_profile(
    db: Session = Depends(get_db),
    current_user=Depends(require_role("provider"))
):
    profile = db.query(ProviderProfile).filter(ProviderProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Provider profile not found")
    return profile


@router.put("/profile/me", response_model=ProviderProfileResponse)
def update_provider_profile(
    data: ProviderProfileUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_role("provider"))
):
    profile = db.query(ProviderProfile).filter(ProviderProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Provider profile not found")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(profile, field, value)
    db.commit()
    db.refresh(profile)
    return profile


@router.get("/", response_model=List[ProviderProfileResponse])
def list_providers(skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    return db.query(ProviderProfile).filter(ProviderProfile.is_available == True).offset(skip).limit(limit).all()


@router.get("/{provider_id}", response_model=ProviderProfileResponse)
def get_provider(provider_id: int, db: Session = Depends(get_db)):
    provider = db.query(ProviderProfile).filter(ProviderProfile.id == provider_id).first()
    if not provider:
        raise HTTPException(status_code=404, detail="Provider not found")
    return provider


@router.get("/technicians/my", response_model=List[TechnicianResponse])
def get_my_technicians(
    db: Session = Depends(get_db),
    current_user=Depends(require_role("provider"))
):
    provider = db.query(ProviderProfile).filter(ProviderProfile.user_id == current_user.id).first()
    if not provider:
        raise HTTPException(status_code=404, detail="Provider profile not found")
    techs = db.query(TechnicianProfile).filter(TechnicianProfile.provider_id == provider.id).all()
    results = []
    for t in techs:
        results.append(TechnicianResponse(
            id=t.id,
            user_id=t.user_id,
            full_name=t.user.full_name if t.user else None,
            email=t.user.email if t.user else None,
            specialization=t.specialization,
            is_available=t.is_available,
            rating=t.rating,
            total_jobs=t.total_jobs
        ))
    return results


@router.post("/technicians", response_model=TechnicianResponse, status_code=201)
def add_technician_to_provider(
    data: TechnicianCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_role("provider"))
):
    from app.crud.user import create_user, get_user_by_email
    from app.schemas.user import UserCreate
    from app.models.user import UserRole
    
    provider = db.query(ProviderProfile).filter(ProviderProfile.user_id == current_user.id).first()
    if not provider:
        raise HTTPException(status_code=404, detail="Provider profile not found")
    
    if get_user_by_email(db, data.email):
        raise HTTPException(status_code=400, detail="User with this email already exists")
    
    new_user = create_user(db, UserCreate(
        email=data.email,
        full_name=data.full_name,
        password=data.password,
        phone=data.phone,
        role=UserRole.technician
    ))
    
    tech_profile = TechnicianProfile(
        user_id=new_user.id,
        provider_id=provider.id,
        specialization=data.specialization,
        bio=data.bio
    )
    db.add(tech_profile)
    db.commit()
    db.refresh(tech_profile)
    
    return TechnicianResponse(
        id=tech_profile.id,
        user_id=new_user.id,
        full_name=new_user.full_name,
        email=new_user.email,
        specialization=tech_profile.specialization,
        is_available=tech_profile.is_available,
        rating=tech_profile.rating,
        total_jobs=tech_profile.total_jobs
    )

