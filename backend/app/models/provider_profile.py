from sqlalchemy import Column, Integer, String, Boolean, Text, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class ProviderProfile(Base):
    __tablename__ = "provider_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    business_name = Column(String(255), nullable=False)
    business_description = Column(Text, nullable=True)
    logo_url = Column(String(500), nullable=True)
    years_experience = Column(Integer, default=0)
    service_area = Column(String(500), nullable=True)
    is_verified = Column(Boolean, default=False)
    is_available = Column(Boolean, default=True)
    rating = Column(Float, default=0.0)
    total_reviews = Column(Integer, default=0)
    total_bookings = Column(Integer, default=0)
    gst_number = Column(String(50), nullable=True)
    bank_account = Column(String(100), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    user = relationship("User", backref="provider_profile")
    services = relationship("Service", back_populates="provider", cascade="all, delete-orphan")

