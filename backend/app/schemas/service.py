from pydantic import BaseModel
from typing import Optional
from decimal import Decimal
from datetime import datetime


class ServiceBase(BaseModel):
    name: str
    description: Optional[str] = None
    base_price: Decimal
    price_unit: str = "per visit"
    duration_hours: float = 1.0
    category_id: Optional[int] = None
    tags: Optional[str] = None


class ServiceCreate(ServiceBase):
    pass


class ServiceUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    base_price: Optional[Decimal] = None
    price_unit: Optional[str] = None
    duration_hours: Optional[float] = None
    category_id: Optional[int] = None
    is_active: Optional[bool] = None
    image_url: Optional[str] = None
    tags: Optional[str] = None


class ServiceResponse(ServiceBase):
    id: int
    provider_id: int
    is_active: bool
    image_url: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}


class ProviderBrief(BaseModel):
    id: int
    business_name: str
    business_description: Optional[str] = None
    rating: float
    total_reviews: int
    years_experience: int
    service_area: Optional[str] = None
    is_verified: bool

    model_config = {"from_attributes": True}


class CategoryBrief(BaseModel):
    id: int
    name: str
    slug: str
    icon_name: Optional[str] = None

    model_config = {"from_attributes": True}


class ServiceDetailResponse(ServiceResponse):
    provider: Optional[ProviderBrief] = None
    category: Optional[CategoryBrief] = None

