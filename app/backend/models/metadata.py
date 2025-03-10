from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from db.base import Base

class Metadata(Base):
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