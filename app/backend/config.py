"""Configuration settings for the Family Vine application.

This module contains the core configuration settings for the Family Vine application,
including database connection, JWT authentication, CORS, and file upload settings.
Settings are loaded from environment variables with fallback default values.
"""

import os
from typing import List
from dotenv import load_dotenv

load_dotenv()

class Settings:
    """Application settings and configuration parameters.
    
    This class holds all the configuration settings for the Family Vine application.
    Settings are loaded from environment variables with sensible defaults for development.
    
    Attributes:
        PROJECT_NAME (str): The name of the project.
        PROJECT_VERSION (str): The current version of the project.
        SQLALCHEMY_DATABASE_URI (str): Database connection URI, defaults to SQLite.
        SECRET_KEY (str): Secret key for JWT token generation.
        ALGORITHM (str): Algorithm used for JWT token encoding/decoding.
        ACCESS_TOKEN_EXPIRE_MINUTES (int): JWT token expiration time in minutes.
        BACKEND_CORS_ORIGINS (List[str]): List of allowed CORS origins.
        UPLOAD_DIRECTORY (str): Directory path for file uploads.
    """
    
    PROJECT_NAME: str = "Family Vine"
    PROJECT_VERSION: str = "0.1.0"
    
    SQLALCHEMY_DATABASE_URI: str = os.getenv("DATABASE_URL", "sqlite:///./family_vine.db")
    
    # JWT settings
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-for-development")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60 * 24 * 7))  # 1 week
    
    # CORS settings
    BACKEND_CORS_ORIGINS: List[str] = os.getenv(
        "BACKEND_CORS_ORIGINS", 
        "http://localhost:3000"
    ).split(",")
    
    # File upload settings
    UPLOAD_DIRECTORY: str = os.getenv("UPLOAD_DIRECTORY", "./uploads")

# Global settings instance
settings = Settings()