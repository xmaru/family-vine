from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class PersonBase(BaseModel):
    name = str
    birthday = Optional[str] = None
    description = Optional[str] = None

class PersonCreate(PersonBase):
    pass

class PersonUpdate(BaseModel):
    name: Optional[str] = None
    birthday: Optional[str] = None
    description: Optional[str] = None

class PersonInDBBase(PersonBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    user_id: int

    class Config:
        from_attributes = True  # Updated from orm_mode

class Person(PersonInDBBase):
    pass 