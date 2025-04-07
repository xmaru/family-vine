"""Security utilities for authentication and authorization.

This module provides functions for handling JWT tokens, password hashing,
and password verification. It uses bcrypt for password hashing and
python-jose for JWT token management.
"""

from datetime import datetime, timedelta
from typing import Any, Union, Optional

from jose import jwt
from passlib.context import CryptContext

from config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_access_token(subject: Union[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """Create a JWT access token for authentication.

    Args:
        subject: The subject to encode in the token. This is typically a user ID.
        expires_delta: Optional timedelta for token expiration. If not provided,
            uses the default expiration time from settings.

    Returns:
        str: The encoded JWT token.

    Note:
        The token is signed using the SECRET_KEY from settings and uses the
        algorithm specified in settings.ALGORITHM.
    """
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain text password against a hashed password.

    Args:
        plain_password: The plain text password to verify.
        hashed_password: The hashed password to check against.

    Returns:
        bool: True if the password matches, False otherwise.
    """
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Generate a secure hash from a plain text password.

    Args:
        password: The plain text password to hash.

    Returns:
        str: The hashed password using bcrypt.
    """
    return pwd_context.hash(password)