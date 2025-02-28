import os
import shutil
import uuid
from fastapi import UploadFile
from typing import List, Optional
from sqlalchemy.orm import Session

from config import settings
from models.document import Document
from models.user import User

class FileService:
    @staticmethod
    def save_file(file: UploadFile, user_id: int) -> str:
        """
        Save uploaded file to the upload directory with a unique name
        Returns the file path relative to the upload directory
        """
        # Generate unique filename to prevent collisions
        filename = f"{uuid.uuid4().hex}_{file.filename}"
        
        # Create user-specific directory
        user_dir = os.path.join(settings.UPLOAD_DIRECTORY, str(user_id))
        os.makedirs(user_dir, exist_ok=True)
        
        # Full path where the file will be saved
        file_path = os.path.join(user_dir, filename)
        
        # Save the file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # Return path relative to the upload directory
        return os.path.join(str(user_id), filename)
    
    @staticmethod
    async def create_document(
        db: Session, 
        file: UploadFile, 
        user_id: int,
        title: str,
        description: Optional[str] = None
    ) -> Document:
        """
        Save the file and create a document record in the database
        """
        # Save the file
        file_path = FileService.save_file(file, user_id)
        
        # Determine file type
        file_type = file.content_type or "application/octet-stream"
        
        # Get file size
        # Move to start of file
        file.file.seek(0, os.SEEK_END)
        file_size = file.file.tell()
        # Reset file position
        file.file.seek(0)
        
        # Create document record
        db_document = Document(
            title=title,
            description=description,
            file_path=file_path,
            file_type=file_type,
            file_size=file_size,
            user_id=user_id
        )
        
        db.add(db_document)
        db.commit()
        db.refresh(db_document)
        
        return db_document
    
    @staticmethod
    def get_file_path(document: Document) -> str:
        """
        Get the full path to a document file
        """
        return os.path.join(settings.UPLOAD_DIRECTORY, document.file_path)
    
    @staticmethod
    def delete_file(document: Document) -> bool:
        """
        Delete a document file from the filesystem
        Returns True if successful, False otherwise
        """
        file_path = FileService.get_file_path(document)
        try:
            if os.path.exists(file_path):
                os.remove(file_path)
                return True
            return False
        except Exception:
            return False
    
    @staticmethod
    def get_documents_for_user(db: Session, user_id: int, skip: int = 0, limit: int = 100) -> List[Document]:
        """
        Get all documents for a user
        """
        return db.query(Document).filter(Document.user_id == user_id).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_document_by_id(db: Session, document_id: int, user_id: int) -> Optional[Document]:
        """
        Get a document by ID for a specific user
        """
        return db.query(Document).filter(Document.id == document_id, Document.user_id == user_id).first()