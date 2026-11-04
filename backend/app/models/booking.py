import enum
from sqlalchemy import Column, Integer, String, Boolean, Text, ForeignKey, DateTime, Numeric, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class BookingStatus(str, enum.Enum):
    pending = "pending"
    confirmed = "confirmed"
    assigned = "assigned"
    in_progress = "in_progress"
    completed = "completed"
    cancelled = "cancelled"
    rejected = "rejected"


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    booking_number = Column(String(20), unique=True, nullable=False)
    customer_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    service_id = Column(Integer, ForeignKey("services.id", ondelete="SET NULL"), nullable=True)
    provider_id = Column(Integer, ForeignKey("provider_profiles.id", ondelete="SET NULL"), nullable=True)
    technician_id = Column(Integer, ForeignKey("technician_profiles.id", ondelete="SET NULL"), nullable=True)
    status = Column(Enum(BookingStatus), default=BookingStatus.pending)
    scheduled_date = Column(DateTime(timezone=True), nullable=False)
    address = Column(String(500), nullable=False)
    city = Column(String(100), nullable=False)
    pincode = Column(String(10), nullable=False)
    notes = Column(Text, nullable=True)
    amount = Column(Numeric(10, 2), nullable=False)
    is_paid = Column(Boolean, default=False)
    cancellation_reason = Column(Text, nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    customer = relationship("User", foreign_keys=[customer_id], backref="bookings_as_customer")
    service = relationship("Service", backref="bookings")
    provider = relationship("ProviderProfile", backref="bookings")
    technician = relationship("TechnicianProfile", backref="assigned_bookings")
    payment = relationship("Payment", back_populates="booking", uselist=False)
    review = relationship("Review", back_populates="booking", uselist=False)

