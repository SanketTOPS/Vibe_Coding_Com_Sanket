from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.deps import get_current_user, require_role
from app.models.review import Review
from app.models.booking import Booking, BookingStatus
from app.models.provider_profile import ProviderProfile
from app.schemas.review import ReviewCreate, ReviewResponse

router = APIRouter(prefix="/reviews", tags=["Reviews"])


@router.post("/", response_model=ReviewResponse, status_code=201)
def create_review(
    data: ReviewCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_role("customer"))
):
    booking = db.query(Booking).filter(Booking.id == data.booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    if booking.customer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    if booking.status != BookingStatus.completed:
        raise HTTPException(status_code=400, detail="Can only review completed bookings")
    
    existing = db.query(Review).filter(Review.booking_id == data.booking_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Review already submitted")
    
    review = Review(
        booking_id=data.booking_id,
        customer_id=current_user.id,
        provider_id=booking.provider_id,
        technician_id=booking.technician_id,
        rating=data.rating,
        comment=data.comment
    )
    db.add(review)
    
    # Update provider rating
    if booking.provider_id:
        provider = db.query(ProviderProfile).filter(ProviderProfile.id == booking.provider_id).first()
        if provider:
            total = provider.total_reviews or 0
            current_rating = provider.rating or 0.0
            provider.rating = round(((current_rating * total) + data.rating) / (total + 1), 2)
            provider.total_reviews = total + 1
    
    db.commit()
    db.refresh(review)
    return review


@router.get("/provider/{provider_id}", response_model=List[ReviewResponse])
def get_provider_reviews(
    provider_id: int,
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    return db.query(Review).filter(Review.provider_id == provider_id, Review.is_published == True).offset(skip).limit(limit).all()


@router.get("/my", response_model=List[ReviewResponse])
def get_my_reviews(
    db: Session = Depends(get_db),
    current_user=Depends(require_role("customer"))
):
    return db.query(Review).filter(Review.customer_id == current_user.id).all()

