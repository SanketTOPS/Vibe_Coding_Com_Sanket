from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class ReviewCreate(BaseModel):
    booking_id: int
    rating: float = Field(ge=1.0, le=5.0)
    comment: Optional[str] = None


class ReviewResponse(BaseModel):
    id: int
    booking_id: int
    customer_id: int
    provider_id: Optional[int] = None
    rating: float
    comment: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}

