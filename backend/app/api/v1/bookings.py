from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.core.deps import get_current_user, require_role
from app.crud.booking import (
    create_booking, get_booking_by_id, get_bookings_by_customer,
    get_bookings_by_provider, get_bookings_by_technician,
    update_booking_status, get_all_bookings
)
from app.models.booking import BookingStatus
from app.models.provider_profile import ProviderProfile
from app.models.technician_profile import TechnicianProfile
from app.schemas.booking import BookingCreate, BookingUpdate, BookingResponse

router = APIRouter(prefix="/bookings", tags=["Bookings"])


@router.post("/", response_model=BookingResponse, status_code=201)
def create_new_booking(data: BookingCreate, db: Session = Depends(get_db), current_user=Depends(require_role("customer"))):
    try:
        return create_booking(db, current_user.id, data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/my", response_model=List[BookingResponse])
def get_my_bookings(skip: int = 0, limit: int = 50, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    role = current_user.role.value
    if role == "customer":
        return get_bookings_by_customer(db, current_user.id, skip, limit)
    elif role == "provider":
        provider = db.query(ProviderProfile).filter(ProviderProfile.user_id == current_user.id).first()
        return get_bookings_by_provider(db, provider.id, skip, limit) if provider else []
    elif role == "technician":
        tech = db.query(TechnicianProfile).filter(TechnicianProfile.user_id == current_user.id).first()
        return get_bookings_by_technician(db, tech.id, skip, limit) if tech else []
    return []


@router.get("/", response_model=List[BookingResponse])
def list_all_bookings(skip: int = 0, limit: int = 100, status: Optional[BookingStatus] = None, db: Session = Depends(get_db), current_user=Depends(require_role("super_admin"))):
    return get_all_bookings(db, skip, limit, status)


@router.get("/{booking_id}", response_model=BookingResponse)
def get_booking(booking_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    booking = get_booking_by_id(db, booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    if current_user.role.value == "customer" and booking.customer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    return booking


@router.patch("/{booking_id}/status")
@router.put("/{booking_id}/status")
def update_status(booking_id: int, data: BookingUpdate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    booking = get_booking_by_id(db, booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    if data.status:
        update_booking_status(db, booking, data.status,
                               technician_id=data.technician_id,
                               cancellation_reason=data.cancellation_reason)
    return {"message": "Booking updated", "booking_id": booking_id, "status": booking.status}

