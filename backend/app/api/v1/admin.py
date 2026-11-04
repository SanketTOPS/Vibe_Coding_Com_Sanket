from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from app.core.database import get_db
from app.core.deps import require_role
from app.models.user import User, UserRole
from app.models.booking import Booking, BookingStatus
from app.models.payment import Payment, PaymentStatus
from app.models.provider_profile import ProviderProfile
from app.schemas.user import UserResponse

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/stats")
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user=Depends(require_role("super_admin"))
):
    total_users = db.query(func.count(User.id)).scalar() or 0
    total_customers = db.query(func.count(User.id)).filter(User.role == UserRole.customer).scalar() or 0
    total_providers = db.query(func.count(User.id)).filter(User.role == UserRole.provider).scalar() or 0
    total_bookings = db.query(func.count(Booking.id)).scalar() or 0
    pending_bookings = db.query(func.count(Booking.id)).filter(Booking.status == BookingStatus.pending).scalar() or 0
    completed_bookings = db.query(func.count(Booking.id)).filter(Booking.status == BookingStatus.completed).scalar() or 0
    total_revenue = db.query(func.sum(Payment.amount)).filter(Payment.status == PaymentStatus.paid).scalar() or 0

    return {
        "total_users": total_users,
        "total_customers": total_customers,
        "total_providers": total_providers,
        "total_bookings": total_bookings,
        "pending_bookings": pending_bookings,
        "completed_bookings": completed_bookings,
        "total_revenue": float(total_revenue)
    }


@router.get("/users", response_model=List[UserResponse])
def admin_list_users(
    skip: int = 0,
    limit: int = 100,
    role: Optional[UserRole] = None,
    db: Session = Depends(get_db),
    current_user=Depends(require_role("super_admin"))
):
    query = db.query(User)
    if role:
        query = query.filter(User.role == role)
    return query.offset(skip).limit(limit).all()


@router.patch("/providers/{provider_id}/verify")
def verify_provider(
    provider_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_role("super_admin"))
):
    provider = db.query(ProviderProfile).filter(ProviderProfile.id == provider_id).first()
    if not provider:
        raise HTTPException(status_code=404, detail="Provider not found")
    provider.is_verified = True
    db.commit()
    return {"message": "Provider verified successfully"}


@router.patch("/users/{user_id}/toggle-status")
def toggle_user_status(
    user_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_role("super_admin"))
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.is_active = not user.is_active
    db.commit()
    return {"message": f"User {'activated' if user.is_active else 'deactivated'}", "is_active": user.is_active}

