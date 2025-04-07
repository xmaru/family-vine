"""Module defining the Person model and related database relationships.

This module contains the SQLAlchemy model definition for Person entities and their
relationships with other models in the system, particularly Documents and Users.
"""

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Table
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from db.base import Base

# Association table for the many-to-many relationship between Document and Person
document_person = Table(
    "document_person",
    Base.metadata,
    Column("document_id", Integer, ForeignKey("documents.id"), primary_key=True),
    Column("person_id", Integer, ForeignKey("people.id"), primary_key=True)
)

class Person(Base):
    """A model representing a person in the system.

    This class defines the structure and relationships for storing person-related
    information in the database. Each person is associated with a user and can
    have multiple documents.

    Attributes:
        id (int): Primary key identifier for the person.
        name (str): The person's name.
        birthday (str, optional): The person's birthday.
        description (str, optional): Additional information about the person.
        created_at (datetime): Timestamp when the person record was created.
        updated_at (datetime): Timestamp when the person record was last updated.
        user_id (int): Foreign key reference to the associated user.
        user (User): Relationship to the associated User model.
        documents (List[Document]): Many-to-many relationship with Document model.
    """

    __tablename__ = "people"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    birthday = Column(String, nullable=True)
    description = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    user_id = Column(Integer, ForeignKey("users.id"))
    
    # Define relationships
    user = relationship("User")
    documents = relationship("Document", secondary=document_person, back_populates="people")