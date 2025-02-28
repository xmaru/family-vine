from typing import Optional
from pydantic import BaseModel, EmailStr, Field

class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: Optional[str] = None
    
class UserCreate(UserBase):
    password: str = Field(..., min_length=8)
    
class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    username: Optional[str] = None
    full_name: Optional[str] = None
    
class UserInDBBase(UserBase):
    id: int
    is_active: bool
    
    class Config:
        from_attributes = True  # Updated from orm_mode
        
class User(UserInDBBase):
    pass

class UserInDB(UserInDBBase):
    hashed_password: str