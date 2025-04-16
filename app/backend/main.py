from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from config import settings
from db.session import engine
from db.base import Base  # This should import all models

# Create database tables
def create_tables():
    Base.metadata.create_all(bind=engine)

def get_application():
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
    from api.routes import auth, documents, visualization

    # Include routers
    _app.include_router(auth, prefix="/api/auth", tags=["auth"])
    _app.include_router(documents, prefix="/api/documents", tags=["documents"])

    # NEW: Visualization router
    _app.include_router(visualization, prefix="/api/visualization", tags=["visualization"])

    return _app

app = get_application()

@app.on_event("startup")
async def startup_event():
    # Create database tables
    create_tables()
    
    # Create upload directory if it doesn't exist
    upload_dir = os.path.normpath(settings.UPLOAD_DIRECTORY)
    os.makedirs(upload_dir, exist_ok=True)

@app.get("/api/health-check")
def health_check():
    return {"status": "ok", "message": "Family Vine API is running"}