from pydantic import BaseModel
from typing import Optional
from decimal import Decimal
from datetime import datetime
from app.models.booking import BookingStatus


class BookingCreate(BaseModel):
    service_id: int
    scheduled_date: datetime
    address: str
    city: str
    pincode: str
    notes: Optional[str] = None


class BookingUpdate(BaseModel):
    status: Optional[BookingStatus] = None
    technician_id: Optional[int] = None
    cancellation_reason: Optional[str] = None
    scheduled_date: Optional[datetime] = None
    notes: Optional[str] = None


class BookingResponse(BaseModel):
    id: int
    booking_number: str
    customer_id: int
    service_id: Optional[int] = None
    provider_id: Optional[int] = None
    technician_id: Optional[int] = None
    status: BookingStatus
    scheduled_date: datetime
    address: str
    city: str
    pincode: str
    notes: Optional[str] = None
    amount: Decimal
    is_paid: bool
    created_at: datetime

    model_config = {"from_attributes": True}

