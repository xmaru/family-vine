from typing import List, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from db.session import get_db
from models.user import User
from schemas.user import User as UserSchema, UserUpdate
from api.dependencies import get_current_active_user
from models import relationship

"""
User API routes module.

This module provides endpoints for user-related operations such as updating
user profiles and managing user accounts. It uses FastAPI for routing and
SQLAlchemy for database operations.
"""

router = APIRouter(
    prefix="/users",
    tags=["users"],
    responses={404: {"description": "Not found"}},
)

@router.put("/me", response_model=UserSchema)
def update_current_user(
    *,
    db: Session = Depends(get_db),
    user_in: UserUpdate,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """Update the current user's profile.
    
    This endpoint allows authenticated users to update their own profile information.
    Only fields that are provided in the request will be updated.
    
    Args:
        db: Database session dependency.
        user_in: User data to update.
        current_user: Currently authenticated user.
        
    Returns:
        Updated user object.
        
    Raises:
        HTTPException: If the user is not authenticated or if the update fails.
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
