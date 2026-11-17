import enum
from sqlalchemy import Column, Integer, String, Numeric, ForeignKey, DateTime, Enum, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class PayoutStatus(str, enum.Enum):
    pending = "pending"
    processing = "processing"
    completed = "completed"
    failed = "failed"


class ProviderPayout(Base):
    __tablename__ = "provider_payouts"

    id = Column(Integer, primary_key=True, index=True)
    provider_id = Column(Integer, ForeignKey("provider_profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    amount = Column(Numeric(10, 2), nullable=False)
    commission_deducted = Column(Numeric(10, 2), default=0.00)
    net_payout = Column(Numeric(10, 2), nullable=False)
    status = Column(Enum(PayoutStatus), default=PayoutStatus.pending, nullable=False)
    payout_method = Column(String(50), default="bank_transfer")
    transaction_reference = Column(String(100), unique=True, nullable=True)
    notes = Column(Text, nullable=True)
    payout_date = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    provider = relationship("ProviderProfile", backref="payouts")

