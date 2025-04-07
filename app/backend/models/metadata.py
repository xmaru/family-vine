from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from db.base import Base

class Metadata(Base):
    """A SQLAlchemy model representing metadata associated with documents.

    This class defines the structure for storing metadata information about documents,
    including who created it, what it contains, when it was created, where it was created,
    and why it was created.

    Attributes:
        id (Integer): Primary key for the metadata record.
        who (String): The person or entity who created or is associated with the document.
        what (String): Description of what the document contains or its purpose.
        when (String): Timestamp or date information about when the document was created.
        where (String): Location information about where the document was created.
        why (String): Explanation of why the document was created.
        creator_of_document (String): The person who created this metadata record.
        created_at (DateTime): Timestamp when the metadata record was created.
        updated_at (DateTime): Timestamp when the metadata record was last updated.
        document_id (Integer): Foreign key reference to the associated document.
        document (relationship): SQLAlchemy relationship to the associated Document model.
    """

    __tablename__ = "metadata"

    id = Column(Integer, primary_key=True, index=True)
    who = Column(String, nullable=False)
    what = Column(String, nullable=True)
    when = Column(String, nullable=True)
    where = Column(String, nullable=True)
    why = Column(String, nullable=True)
    creator_of_document = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    document_id = Column(Integer, ForeignKey("documents.id"), unique=True)
    
    # Define relationship
    document = relationship("Document", back_populates="document_metadata")