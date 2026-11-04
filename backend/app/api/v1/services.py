from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.core.deps import get_current_user, require_role
from app.models.service import Service
from app.models.provider_profile import ProviderProfile
from app.schemas.service import ServiceCreate, ServiceUpdate, ServiceResponse, ServiceDetailResponse

router = APIRouter(prefix="/services", tags=["Services"])


@router.get("/", response_model=List[ServiceResponse])
def list_services(category_id: Optional[int] = None, search: Optional[str] = None, skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    query = db.query(Service).filter(Service.is_active == True)
    if category_id:
        query = query.filter(Service.category_id == category_id)
    if search:
        query = query.filter(Service.name.ilike(f"%{search}%"))
    return query.offset(skip).limit(limit).all()


@router.get("/{service_id}", response_model=ServiceDetailResponse)
def get_service(service_id: int, db: Session = Depends(get_db)):
    svc = db.query(Service).filter(Service.id == service_id).first()
    if not svc:
        raise HTTPException(status_code=404, detail="Service not found")
    return svc


@router.post("/", response_model=ServiceResponse, status_code=201)
def create_service(data: ServiceCreate, db: Session = Depends(get_db), current_user=Depends(require_role("provider"))):
    provider = db.query(ProviderProfile).filter(ProviderProfile.user_id == current_user.id).first()
    if not provider:
        raise HTTPException(status_code=404, detail="Provider profile not found. Please create your provider profile first.")
    svc = Service(provider_id=provider.id, **data.model_dump())
    db.add(svc)
    db.commit()
    db.refresh(svc)
    return svc


@router.put("/{service_id}", response_model=ServiceResponse)
def update_service(service_id: int, data: ServiceUpdate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    svc = db.query(Service).filter(Service.id == service_id).first()
    if not svc:
        raise HTTPException(status_code=404, detail="Service not found")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(svc, field, value)
    db.commit()
    db.refresh(svc)
    return svc


@router.delete("/{service_id}")
def delete_service(service_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    svc = db.query(Service).filter(Service.id == service_id).first()
    if not svc:
        raise HTTPException(status_code=404, detail="Service not found")
    svc.is_active = False
    db.commit()
    return {"message": "Service deactivated"}

