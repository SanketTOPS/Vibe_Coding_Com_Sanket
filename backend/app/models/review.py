from sqlalchemy import Column, Integer, Float, String, ForeignKey, Text, Boolean, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(Integer, ForeignKey("bookings.id", ondelete="CASCADE"), unique=True, nullable=False)
    customer_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    provider_id = Column(Integer, ForeignKey("provider_profiles.id", ondelete="SET NULL"), nullable=True)
    technician_id = Column(Integer, ForeignKey("technician_profiles.id", ondelete="SET NULL"), nullable=True)
    rating = Column(Float, nullable=False)
    comment = Column(Text, nullable=True)
    is_published = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    booking = relationship("Booking", back_populates="review")
    customer = relationship("User", foreign_keys=[customer_id])
    provider = relationship("ProviderProfile", backref="reviews")

