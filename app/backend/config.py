# config.py - Configuration settings
import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = "Family Vine"
    PROJECT_VERSION: str = "0.1.0"
    
    SQLALCHEMY_DATABASE_URI: str = os.getenv("DATABASE_URL", "sqlite:///./family_vine.db")
    
    # JWT settings
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-for-development")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 1 week
    
    # CORS settings
    BACKEND_CORS_ORIGINS: list = ["http://localhost:3000"]  # Frontend URL

settings = Settings()