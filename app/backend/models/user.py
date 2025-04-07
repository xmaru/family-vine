from sqlalchemy import Boolean, Column, Integer, String, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from db.base import Base

class User(Base):
    """A SQLAlchemy model representing a user in the system.

    This model stores essential user information including authentication details,
    personal information, and account status. It serves as the primary user entity
    for the application.

    Attributes:
        id (Integer): Primary key identifier for the user.
        email (String): Unique email address used for user identification and communication.
        username (String): Unique username for user identification and display.
        hashed_password (String): Securely hashed password for user authentication.
        full_name (String): User's complete name, optional.
        is_active (Boolean): Flag indicating whether the user account is active.
        created_at (DateTime): Timestamp of when the user account was created.
        updated_at (DateTime): Timestamp of when the user account was last updated.
        documents (relationship): One-to-many relationship with Document model.
    """

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Define relationships
    documents = relationship("Document", back_populates="user")