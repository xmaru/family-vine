"""FastAPI application initialization and configuration module.

This module handles the creation and configuration of the FastAPI application,
including database initialization, CORS middleware setup, and route registration.
It also provides health check endpoints and startup event handlers.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from config import settings
from db.session import engine
from db.base import Base  # This should import all models

def create_tables():
    """Create all database tables defined in the models.
    
    This function uses SQLAlchemy's create_all method to create all tables
    that are defined in the models imported through the Base class.
    """
    Base.metadata.create_all(bind=engine)

def get_application():
    """Create and configure the FastAPI application.
    
    Returns:
        FastAPI: A configured FastAPI application instance with:
            - Project metadata (title and version)
            - CORS middleware
            - Registered API routers for authentication and documents
    """
    _app = FastAPI(
        title=settings.PROJECT_NAME,
        version=settings.PROJECT_VERSION,
    )

    # Set up CORS
    _app.add_middleware(
        CORSMiddleware,
        # Allow all origins for development - make sure to restrict this in production
        allow_origins=["*"],  # Temporary fix to allow all origins
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Import API routers here to avoid circular imports
    from api.routes import auth, documents

    # Include routers
    _app.include_router(auth, prefix="/api/auth", tags=["auth"])
    _app.include_router(documents, prefix="/api/documents", tags=["documents"])

    return _app

app = get_application()

@app.on_event("startup")
async def startup_event():
    """Initialize application on startup.
    
    This event handler runs when the application starts and:
    1. Creates all database tables
    2. Ensures the upload directory exists for file storage
    """
    # Create database tables
    create_tables()
    
    # Create upload directory if it doesn't exist
    upload_dir = os.path.normpath(settings.UPLOAD_DIRECTORY)
    os.makedirs(upload_dir, exist_ok=True)

@app.get("/api/health-check")
def health_check():
    """Check the health status of the API.
    
    Returns:
        dict: A dictionary containing the API status and a message indicating
              that the Family Vine API is running.
    """
    return {"status": "ok", "message": "Family Vine API is running"}