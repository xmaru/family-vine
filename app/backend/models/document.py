from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from db.base import Base

class Document(Base):
    """A model representing a document in the system.

    This class defines the structure and relationships for documents stored in the database.
    Documents can be associated with users, metadata, and people.

    Attributes:
        id (int): Primary key identifier for the document.
        title (str): The title of the document.
        description (str, optional): A description of the document's contents.
        file_path (str): The path where the document file is stored.
        file_type (str): The type/format of the document file.
        file_size (int): The size of the document file in bytes.
        created_at (datetime): Timestamp when the document was created.
        updated_at (datetime): Timestamp when the document was last updated.
        user_id (int): Foreign key reference to the user who owns this document.
        user (User): Relationship to the user who owns this document.
        document_metadata (Metadata): One-to-one relationship with document metadata.
        people (List[Person]): Many-to-many relationship with people associated with this document.
    """

    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(String, nullable=True)
    file_path = Column(String)
    file_type = Column(String)
    file_size = Column(Integer)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    user_id = Column(Integer, ForeignKey("users.id"))
    
    # Define relationships
    user = relationship("User", back_populates="documents")
    document_metadata = relationship("Metadata", back_populates="document", uselist=False)
    people = relationship("Person", secondary="document_person", back_populates="documents")