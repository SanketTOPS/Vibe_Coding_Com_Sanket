from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Time, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class TechnicianSchedule(Base):
    __tablename__ = "technician_schedules"

    id = Column(Integer, primary_key=True, index=True)
    technician_id = Column(Integer, ForeignKey("technician_profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    day_of_week = Column(Integer, nullable=False)  # 0 = Monday, 6 = Sunday
    start_time = Column(String(10), default="09:00")  # HH:MM format
    end_time = Column(String(10), default="18:00")
    is_available = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    technician = relationship("TechnicianProfile", backref="schedules")

