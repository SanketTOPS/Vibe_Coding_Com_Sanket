from sqlalchemy import Column, Integer, String, Boolean, Text, Float, ForeignKey, Numeric, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class Service(Base):
    __tablename__ = "services"

    id = Column(Integer, primary_key=True, index=True)
    provider_id = Column(Integer, ForeignKey("provider_profiles.id", ondelete="CASCADE"), nullable=False)
    category_id = Column(Integer, ForeignKey("service_categories.id", ondelete="SET NULL"), nullable=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    base_price = Column(Numeric(10, 2), nullable=False)
    price_unit = Column(String(50), default="per visit")
    duration_hours = Column(Float, default=1.0)
    is_active = Column(Boolean, default=True)
    image_url = Column(String(500), nullable=True)
    tags = Column(String(500), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    provider = relationship("ProviderProfile", back_populates="services")
    category = relationship("ServiceCategory", backref="services")

