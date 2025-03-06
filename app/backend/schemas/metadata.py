from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class MetadataBase(BaseModel):
    who: str
    what: Optional[str] = None
    when: Optional[str] = None
    where: Optional[str] = None
    why: Optional[str] = None
    creator_of_document: str

class MetadataCreate(MetadataBase):
    pass

class MetadataUpdate(BaseModel):
    who: Optional[str] = None
    what: Optional[str] = None
    when: Optional[str] = None
    where: Optional[str] = None
    why: Optional[str] = None
    creator_of_document: Optional[str] = None

class MetadataInDBBase(MetadataBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    document_id: int

    class Config:
        from_attributes = True  # Updated from orm_mode

class Metadata(MetadataInDBBase):
    pass 