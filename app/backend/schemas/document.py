from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class DocumentBase(BaseModel):
    title: str
    description: Optional[str] = None

class DocumentCreate(DocumentBase):
    pass

class DocumentUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None

class DocumentInDBBase(DocumentBase):
    id: int
    file_path: str
    file_type: str
    file_size: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class Document(DocumentInDBBase):
    pass

class DocumentWithDownloadUrl(Document):
    download_url: str