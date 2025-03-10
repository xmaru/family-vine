from datetime import datetime
from typing import Optional
from pydantic import BaseModel
from schemas.person import Person

class RelationshipBase(BaseModel):
    person_id_1: int
    person_id_2: int
    relationship_type: str  # e.g., "parent", "child", "sibling", "spouse"

class RelationshipCreate(RelationshipBase):
    pass 

class RelationshipUpdate(BaseModel):
    relationship_type: Optional[str] = None

class RelationshipInDBBase(RelationshipBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True  # Enables ORM mode

class Relationship(RelationshipInDBBase):
    pass

# Schema to include Person Details 
class RelationshipWithPersons(Relationship):
    person_1: Person 
    person_2: Person

    class Config:
        from_attributes = True
