from sqlalchemy import Column, Integer, String, Boolean, Text, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class TechnicianProfile(Base):
    __tablename__ = "technician_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    provider_id = Column(Integer, ForeignKey("provider_profiles.id", ondelete="SET NULL"), nullable=True)
    specialization = Column(String(255), nullable=True)
    bio = Column(Text, nullable=True)
    is_available = Column(Boolean, default=True)
    rating = Column(Float, default=0.0)
    total_jobs = Column(Integer, default=0)
    id_proof_url = Column(String(500), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    user = relationship("User", backref="technician_profile")
    provider = relationship("ProviderProfile", backref="technicians")

