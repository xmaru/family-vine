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
    """Service class for handling file operations and document management.
    
    This class provides functionality for saving, retrieving, and managing files
    and their associated document records in the database. It handles file storage,
    document creation, and relationships between documents and persons.
    """

    @staticmethod
    def save_file(file: UploadFile, user_id: int) -> str:
        """Save an uploaded file to the user's directory with a unique name.

        Args:
            file (UploadFile): The file to be saved.
            user_id (int): The ID of the user uploading the file.

        Returns:
            str: The relative file path where the file was saved.
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
        """Create a new document record and save the associated file.

        Args:
            db (Session): Database session.
            file (UploadFile): The file to be saved.
            user_id (int): The ID of the user creating the document.
            title (str): The title of the document.
            description (Optional[str], optional): Description of the document. Defaults to None.

        Returns:
            Document: The created document record.
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
        """Get the full filesystem path for a document.

        Args:
            document (Document): The document object.

        Returns:
            str: The absolute file path.
        """
        return os.path.join(settings.UPLOAD_DIRECTORY, document.file_path)
    
    @staticmethod
    def delete_file(document: Document) -> bool:
        """Delete a document's file from the filesystem.

        Args:
            document (Document): The document whose file should be deleted.

        Returns:
            bool: True if deletion was successful, False otherwise.
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
        """Retrieve all documents uploaded by a specific user.

        Args:
            db (Session): Database session.
            user_id (int): The ID of the user.
            skip (int, optional): Number of records to skip. Defaults to 0.
            limit (int, optional): Maximum number of records to return. Defaults to 100.

        Returns:
            List[Document]: List of documents belonging to the user.
        """
        return db.query(Document).filter(Document.user_id == user_id).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_documents_for_person(db: Session, person_id: int) -> List[Document]:
        """Retrieve all documents associated with a specific person.

        Args:
            db (Session): Database session.
            person_id (int): The ID of the person.

        Returns:
            List[Document]: List of documents associated with the person.

        Raises:
            ValueError: If the person is not found.
        """
        person = db.query(Person).filter(Person.id == person_id).first()
        if not person:
            raise ValueError("Person not found")
        
        return [doc for doc in person.documents] 
      
    @staticmethod
    def get_document_by_id(db: Session, document_id: int, user_id: int) -> Optional[Document]:
        """Retrieve a specific document by its ID for a given user.

        Args:
            db (Session): Database session.
            document_id (int): The ID of the document.
            user_id (int): The ID of the user who owns the document.

        Returns:
            Optional[Document]: The document if found, None otherwise.
        """
        return db.query(Document).filter(Document.id == document_id, Document.user_id == user_id).first()
    
    @staticmethod
    def get_person_document_by_id(db: Session, person_id: int, document_id: int) -> Optional[Document]:
        """Retrieve a specific document associated with a person.

        Args:
            db (Session): Database session.
            person_id (int): The ID of the person.
            document_id (int): The ID of the document.

        Returns:
            Optional[Document]: The document if found, None otherwise.

        Raises:
            ValueError: If the person is not found.
        """
        person = db.query(Person).filter(Person.id == person_id).first()
        if not person:
            raise ValueError("Person not found")
        
        return next((doc for doc in person.documents if doc.id == document_id), None)
    
    @staticmethod
    def get_person_documents_for_visualization(db: Session, person_id: int) -> List[Dict[str, str]]:
        """Retrieve simplified document information for visualization purposes.

        Args:
            db (Session): Database session.
            person_id (int): The ID of the person.

        Returns:
            List[Dict[str, str]]: List of dictionaries containing document ID, title, and description.

        Raises:
            ValueError: If the person is not found.
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
        """Establish a connection between a person and a document.

        Args:
            db (Session): Database session.
            person_id (int): The ID of the person.
            document_id (int): The ID of the document.

        Raises:
            ValueError: If either the person or document is not found.
        """
        person = db.query(Person).filter(Person.id == person_id).first()
        document = db.query(Document).filter(Document.id == document_id).first()
        
        if not person or not document:
            raise ValueError("Person or Document not found")
        
        if document not in person.documents:
            person.documents.append(document)
            db.commit()