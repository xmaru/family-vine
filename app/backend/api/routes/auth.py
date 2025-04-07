"""
Authentication routes for the Family Vine application.

This module provides endpoints for user registration, login, and retrieving
current user information. It implements OAuth2 compatible token-based authentication.
"""

from datetime import timedelta
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from config import settings
from core.security import create_access_token, get_password_hash, verify_password
from db.session import get_db
from models.user import User
from models.person import Person
from schemas.token import Token
from schemas.user import User as UserSchema, UserCreate, UserInDB
from api.dependencies import get_current_active_user

router = APIRouter()

@router.post("/register", response_model=UserSchema)
async def register(
    *,
    request: Request,
    db: Session = Depends(get_db),
    user_in: UserCreate,
) -> Any:
    """Register a new user in the system.
    
    Args:
        request: The FastAPI request object.
        db: Database session.
        user_in: User data for registration.
        
    Returns:
        User: The newly created user object.
        
    Raises:
        HTTPException: If email or username is already registered.
    """
    # Debug - log request data
    print("Register request received")  
    print(f"Request headers: {request.headers}")
    try:
        body = await request.json()
        print(f"Request body: {body}")
    except Exception as e:
        print(f"Error reading request body: {e}")
    
    # Check if user with this email already exists
    user = db.query(User).filter(User.email == user_in.email).first()
    if user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )
        
    # Check if username is taken
    user = db.query(User).filter(User.username == user_in.username).first()
    if user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken",
        )
        
    # Create new user
    user = User(
        email=user_in.email,
        username=user_in.username,
        hashed_password=get_password_hash(user_in.password),
        full_name=user_in.full_name,
    )

    # Create person entry for user
    user_person = Person(
        name=user_in.full_name,
        description="User"
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    db.add(user_person)
    db.commit()
    db.refresh(user_person)
    
    return user

@router.post("/login", response_model=Token)
def login(
    db: Session = Depends(get_db),
    form_data: OAuth2PasswordRequestForm = Depends(),
) -> Any:
    """Authenticate a user and return an access token.
    
    This endpoint implements OAuth2 compatible token login, allowing users to
    obtain an access token for future authenticated requests.
    
    Args:
        db: Database session.
        form_data: OAuth2 form data containing username and password.
        
    Returns:
        dict: Access token and token type.
        
    Raises:
        HTTPException: If authentication fails.
    """
    # Debug - log login attempt
    print(f"Login attempt for user: {form_data.username}")
    
    # Try to find user by email
    user = db.query(User).filter(User.email == form_data.username).first()
    
    # If not found by email, try by username
    if not user:
        user = db.query(User).filter(User.username == form_data.username).first()
        
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email/username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": create_access_token(
            user.id, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    }

@router.get("/me", response_model=UserSchema)
def get_current_user_info(
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """Retrieve information about the currently authenticated user.
    
    Args:
        current_user: The currently authenticated user.
        
    Returns:
        User: The current user object.
    """
    print(f"Getting info for user ID: {current_user.id}")
    return current_user

# Add a simple OPTIONS handler for the register endpoint
@router.options("/register")
async def options_register():
    """Handle OPTIONS requests for the register endpoint.
    
    Returns:
        dict: Empty response for CORS preflight requests.
    """
    return {}

# Add a simple OPTIONS handler for the me endpoint
@router.options("/me")
async def options_me():
    """Handle OPTIONS requests for the me endpoint.
    
    Returns:
        dict: Empty response for CORS preflight requests.
    """
    return {}