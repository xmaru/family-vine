"""Database session management module.

This module provides functionality for creating and managing database sessions
using SQLAlchemy. It sets up the database engine and provides a session factory
and dependency function for FastAPI applications.
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from config import settings

# Create the SQLAlchemy engine with appropriate connection settings
engine = create_engine(
    settings.SQLALCHEMY_DATABASE_URI, 
    connect_args={"check_same_thread": False}  # For SQLite only
)

# Create a session factory that will be used to create database sessions
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    """Create and yield a database session.
    
    This function is designed to be used as a FastAPI dependency. It creates
    a new database session, yields it for use in the request, and ensures
    the session is properly closed after the request is complete.
    
    Yields:
        Session: A SQLAlchemy database session.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()