import os
import shutil
import uuid
from fastapi import UploadFile
from typing import Dict, List, Optional
from sqlalchemy.orm import Session

from config import settings
from models.document import Document
from models.person import Person

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
        Get all documents the user has uploaded
        """
        return db.query(Document).filter(Document.user_id == user_id).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_documents_for_person(db: Session, person_id: int) -> List[Document]:
        """
        Get all documents a person is connected to
        """
        person = db.query(Person).filter(Person.id == person_id).first()
        if not person:
            raise ValueError("Person not found")
        
        return [doc for doc in person.documents] 
      
    @staticmethod
    def get_document_by_id(db: Session, document_id: int, user_id: int) -> Optional[Document]:
        """
        Get a document by ID uploaded by the user
        """
        return db.query(Document).filter(Document.id == document_id, Document.user_id == user_id).first()
    
    def get_person_document_by_id(db: Session, person_id: int, document_id: int) -> Optional[Document]:
        """
        Get a document by ID connected to a specific person
        """
        person = db.query(Person).filter(Person.id == person_id).first()
        if not person:
            raise ValueError("Person not found")
        
        return next((doc for doc in person.documents if doc.id == document_id), None)
    
    @staticmethod
    def get_person_documents_for_visualization(db: Session, person_id: int) -> List[Dict[str, str]]:
        """
        Get all documents connected to a person - strictly returning document ID, title, and description
        """
        person = db.query(Person).filter(Person.id == person_id).first()
        if not person:
            raise ValueError("Person not found")
        
        return [
            {"id": doc.id, "title": doc.title, "description": doc.description}
            for doc in person.documents
        ]
    
    @staticmethod
    def connect_person_to_document(db: Session, person_id: int, document_id: int) -> None:
        """
        Connects a person to a document by adding an entry to the document_person association table
        """
        person = db.query(Person).filter(Person.id == person_id).first()
        document = db.query(Document).filter(Document.id == document_id).first()
        
        if not person or not document:
            raise ValueError("Person or Document not found")
        
        if document not in person.documents:
            person.documents.append(document)
            db.commit()