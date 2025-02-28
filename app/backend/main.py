from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from app.backend.api.routes import documents
from config import settings
from db.session import engine
from db.base import Base

# Import API routers
from api.routes import auth, metadata, people, relationships, visualization

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
        allow_origins=settings.BACKEND_CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Include routers
    _app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
    _app.include_router(documents.router, prefix="/api/documents", tags=["documents"])
    _app.include_router(metadata.router, prefix="/api/documents/{document_id}/metadata", tags=["metadata"])
    _app.include_router(people.router, prefix="/api/people", tags=["people"])
    _app.include_router(relationships.router, prefix="/api/relationships", tags=["relationships"])
    _app.include_router(visualization.router, prefix="/api/visualization", tags=["visualization"])

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