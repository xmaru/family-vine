from typing import List, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from db.session import get_db
from models.user import User
from schemas.user import User as UserSchema, UserUpdate
from api.dependencies import get_current_active_user

router = APIRouter()

@router.put("/me", response_model=UserSchema)
def update_current_user(
    *,
    db: Session = Depends(get_db),
    user_in: UserUpdate,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Update the current user's profile
    """
    for field, value in user_in.model_dump(exclude_unset=True).items():
        setattr(current_user, field, value)

    db.add(current_user)
    db.commit()
    db.refresh(current_user)

    return current_user

'''
Can add other endpoints like those listed below for admin only later:

GET /users/ - Get a list of users
GET /users/{user_id} - Retrieve a specific user by ID 
PUT /users/{user_id}/deactivate - Deactivate a user 
PUT /users/{user_id}/activate - Reactivate a user 
'''
