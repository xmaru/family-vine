from typing import Generator, Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from pydantic import ValidationError

from db.session import get_db
from schemas.token import TokenPayload
from models.user import User
from config import settings

"""
Authentication and authorization dependencies for the FastAPI application.

This module provides dependency functions for user authentication and authorization
using JWT tokens. It includes functions to retrieve the current user from a JWT token
and to verify that the user is active.
"""

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

def get_current_user(
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme)
) -> User:
    """
    Retrieve the current user from a JWT token.
    
    This function decodes the JWT token, validates it, and retrieves the corresponding
    user from the database.
    
    Args:
        db: Database session.
        token: JWT token from the request.
        
    Returns:
        User: The user object corresponding to the token.
        
    Raises:
        HTTPException: If the token is invalid or the user is not found.
    """
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        token_data = TokenPayload(**payload)
    except (JWTError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
        )
        
    user = db.query(User).filter(User.id == token_data.sub).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
        
    return user

def get_current_active_user(
    current_user: User = Depends(get_current_user),
) -> User:
    """
    Verify and return the current active user.
    
    This function checks if the current user is active and returns it.
    It depends on get_current_user to retrieve the user first.
    
    Args:
        current_user: The user object retrieved by get_current_user.
        
    Returns:
        User: The active user object.
        
    Raises:
        HTTPException: If the user is inactive.
    """
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user",
        )
        
    return current_user