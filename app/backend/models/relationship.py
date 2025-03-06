from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from db.base import Base

class Relationship(Base):
    __tablename__ = "person_relationships"

    id = Column(Integer, primary_key=True, index=True)
    person_id_1 = Column(Integer, ForeignKey("people.id"), nullable=False)
    person_id_2 = Column(Integer, ForeignKey("people.id"), nullable=False)
    relationship_type = Column(String, nullable=False)  # e.g., "parent", "child", "spouse", "sibling"
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False) 

    # Track relationships where this person is the first person 
    person_1 = relationship("Person", foreign_keys=[person_id_1], backref="relationships_as_person_1")
    # Track relationships where this person is the second person connected
    person_2 = relationship("Person", foreign_keys=[person_id_2], backref="relationships_as_person_2")
    # Track which user created the relationship
    user = relationship("User", backref="created_relationships")
