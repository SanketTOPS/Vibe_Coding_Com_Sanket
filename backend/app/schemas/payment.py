from pydantic import BaseModel
from typing import Optional
from decimal import Decimal
from app.models.payment import PaymentStatus


class PaymentOrderCreate(BaseModel):
    booking_id: int


class PaymentVerify(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str


class PaymentResponse(BaseModel):
    id: int
    booking_id: int
    razorpay_order_id: Optional[str] = None
    razorpay_payment_id: Optional[str] = None
    amount: Decimal
    currency: str
    status: PaymentStatus

    model_config = {"from_attributes": True}

