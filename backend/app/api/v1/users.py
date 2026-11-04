from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.core.deps import get_current_user, require_role
from app.crud.user import get_users, get_user_by_id, update_user, deactivate_user
from app.schemas.user import UserResponse, UserUpdate
from app.models.user import UserRole

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/", response_model=List[UserResponse])
def list_users(skip: int = 0, limit: int = 50, role: Optional[UserRole] = None, db: Session = Depends(get_db), current_user=Depends(require_role("super_admin"))):
    return get_users(db, skip=skip, limit=limit, role=role)


@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    if current_user.id != user_id and current_user.role.value != "super_admin":
        raise HTTPException(status_code=403, detail="Access denied")
    user = get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.put("/{user_id}", response_model=UserResponse)
def update_user_profile(user_id: int, update_data: UserUpdate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    if current_user.id != user_id and current_user.role.value != "super_admin":
        raise HTTPException(status_code=403, detail="Access denied")
    user = get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return update_user(db, user, update_data)


@router.delete("/{user_id}")
def deactivate_user_account(user_id: int, db: Session = Depends(get_db), current_user=Depends(require_role("super_admin"))):
    user = get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    deactivate_user(db, user)
    return {"message": "User deactivated successfully"}

