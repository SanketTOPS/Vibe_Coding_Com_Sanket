from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from app.core.database import Base


class ServiceArea(Base):
    __tablename__ = "service_areas"

    id = Column(Integer, primary_key=True, index=True)
    city = Column(String(100), nullable=False, index=True)
    state = Column(String(100), nullable=False)
    pincode = Column(String(10), unique=True, nullable=False, index=True)
    area_name = Column(String(255), nullable=False)
    is_serviceable = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

