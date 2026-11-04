import random
import string
from datetime import datetime
from sqlalchemy.orm import Session
from typing import Optional, List
from app.models.booking import Booking, BookingStatus
from app.models.service import Service
from app.schemas.booking import BookingCreate


def generate_booking_number() -> str:
    return "HS" + "".join(random.choices(string.digits, k=8))


def create_booking(db: Session, customer_id: int, booking_data: BookingCreate) -> Booking:
    service = db.query(Service).filter(Service.id == booking_data.service_id).first()
    if not service:
        raise ValueError("Service not found")
    booking = Booking(
        booking_number=generate_booking_number(),
        customer_id=customer_id,
        service_id=booking_data.service_id,
        provider_id=service.provider_id,
        scheduled_date=booking_data.scheduled_date,
        address=booking_data.address,
        city=booking_data.city,
        pincode=booking_data.pincode,
        notes=booking_data.notes,
        amount=service.base_price,
        status=BookingStatus.pending,
    )
    db.add(booking)
    db.commit()
    db.refresh(booking)
    return booking


def get_booking_by_id(db: Session, booking_id: int) -> Optional[Booking]:
    return db.query(Booking).filter(Booking.id == booking_id).first()


def get_bookings_by_customer(db: Session, customer_id: int, skip: int = 0, limit: int = 50) -> List[Booking]:
    return db.query(Booking).filter(Booking.customer_id == customer_id).order_by(Booking.created_at.desc()).offset(skip).limit(limit).all()


def get_bookings_by_provider(db: Session, provider_id: int, skip: int = 0, limit: int = 50) -> List[Booking]:
    return db.query(Booking).filter(Booking.provider_id == provider_id).order_by(Booking.created_at.desc()).offset(skip).limit(limit).all()


def get_bookings_by_technician(db: Session, technician_id: int, skip: int = 0, limit: int = 50) -> List[Booking]:
    return db.query(Booking).filter(Booking.technician_id == technician_id).order_by(Booking.created_at.desc()).offset(skip).limit(limit).all()


def update_booking_status(db: Session, booking: Booking, status: BookingStatus, **kwargs) -> Booking:
    booking.status = status
    for key, value in kwargs.items():
        if value is not None:
            setattr(booking, key, value)
    if status == BookingStatus.completed:
        booking.completed_at = datetime.utcnow()
    db.commit()
    db.refresh(booking)
    return booking


def get_all_bookings(db: Session, skip: int = 0, limit: int = 100, status: Optional[BookingStatus] = None) -> List[Booking]:
    query = db.query(Booking)
    if status:
        query = query.filter(Booking.status == status)
    return query.order_by(Booking.created_at.desc()).offset(skip).limit(limit).all()

