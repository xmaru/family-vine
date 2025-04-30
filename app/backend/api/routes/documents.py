"""API routes for document management in the Family Vine application.

This module provides endpoints for managing documents, including uploading, downloading,
connecting documents to persons, and managing document metadata. It handles file operations
and document-person relationships through a RESTful API interface.

The module integrates with the database through SQLAlchemy and provides file handling
capabilities through the FileService.
"""

from typing import List, Any
import os
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status, Response
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from api.dependencies import get_current_active_user
from db.session import get_db
from models.user import User
from models.document import Document
from schemas.document import Document as DocumentSchema, DocumentCreate, DocumentUpdate, DocumentWithDownloadUrl, DocumentVisualize
from services.file_service import FileService

router = APIRouter()

@router.post("/", response_model=DocumentSchema)
async def upload_document(
    *,
    db: Session = Depends(get_db),
    title: str = Form(...),
    description: str = Form(None),
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """Upload a new document to the system.

    Args:
        db (Session): Database session.
        title (str): Title of the document.
        description (str, optional): Description of the document.
        file (UploadFile): The file to be uploaded.
        current_user (User): Currently authenticated user.

    Returns:
        DocumentSchema: The created document object.

    Raises:
        HTTPException: If no file is provided (400 Bad Request).
    """
    # Check if file was provided
    if not file:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No file provided"
        )
    
    # Create document
    document = await FileService.create_document(
        db=db,
        file=file,
        user_id=current_user.id,
        title=title,
        description=description
    )
    
    return document

@router.post("/{person_id}/{document_id}", response_model=DocumentSchema)
async def connect_person_to_document(
    *,
    db: Session = Depends(get_db),
    person_id: int,
    document_id: int,
) -> Any:
    """Connect a document to a person in the family tree.

    Args:
        db (Session): Database session.
        person_id (int): ID of the person to connect the document to.
        document_id (int): ID of the document to connect.

    Returns:
        DocumentSchema: The updated document object with person connection.
    """
    document = await FileService.connect_person_to_document(
        db=db,
        person_id=person_id,
        document_id=document_id
    )
    
    return document

@router.get("/", response_model=List[DocumentSchema])
def get_user_documents(
    *,
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """Retrieve all documents uploaded by the current user.

    Args:
        db (Session): Database session.
        skip (int, optional): Number of records to skip. Defaults to 0.
        limit (int, optional): Maximum number of records to return. Defaults to 100.
        current_user (User): Currently authenticated user.

    Returns:
        List[DocumentSchema]: List of documents belonging to the current user.
    """
    documents = FileService.get_documents_for_user(
        db=db,
        user_id=current_user.id,
        skip=skip,
        limit=limit
    )
    
    return documents

@router.get("/{person_id}", response_model=List[DocumentSchema])
def get_person_documents(
    *,
    person_id: int,
    db: Session = Depends(get_db),
) -> Any:
    """Retrieve all documents connected to a specific person.

    Args:
        person_id (int): ID of the person whose documents to retrieve.
        db (Session): Database session.

    Returns:
        List[DocumentSchema]: List of documents connected to the specified person.
    """
    documents = FileService.get_documents_for_person(
        db=db,
        person_id=person_id,
    )
    
    return documents

@router.get("/{person_id}", response_model=List[DocumentVisualize])
def get_person_documents_for_visualization(
    *,
    person_id: int,
    db: Session = Depends(get_db),
) -> Any:
    """Retrieve documents connected to a person for visualization purposes.

    This endpoint returns a simplified version of documents containing only
    essential fields (ID, title, and description) for visualization.

    Args:
        person_id (int): ID of the person whose documents to retrieve.
        db (Session): Database session.

    Returns:
        List[DocumentVisualize]: List of simplified document objects for visualization.
    """
    documents = FileService.get_person_documents_for_visualization(
        db=db,
        person_id=person_id,
    )
    
    return documents

@router.get("/{document_id}/download")
def download_document(
    *,
    db: Session = Depends(get_db),
    document_id: int,
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """Download a document file.

    Args:
        db (Session): Database session.
        document_id (int): ID of the document to download.
        current_user (User): Currently authenticated user.

    Returns:
        FileResponse: The document file as a downloadable response.

    Raises:
        HTTPException: If document or file is not found (404 Not Found).
    """
    document = FileService.get_document_by_id(
        db=db,
        document_id=document_id,
        user_id=current_user.id
    )
    
    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )
    
    file_path = FileService.get_file_path(document)
    
    if not os.path.exists(file_path):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File not found on server"
        )
    
    # Get original filename from path
    original_filename = os.path.basename(document.file_path).split("_", 1)[1]
    
    return FileResponse(
        path=file_path,
        filename=original_filename,
        media_type=document.file_type
    )

@router.get("/{person_id}/{document_id}/download")
def download_document_by_person(
    *,
    db: Session = Depends(get_db),
    person_id: int,
    document_id: int,
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """Download a document file that is connected to a specific person.

    Args:
        db (Session): Database session.
        person_id (int): ID of the person connected to the document.
        document_id (int): ID of the document to download.
        current_user (User): Currently authenticated user.

    Returns:
        FileResponse: The document file as a downloadable response.

    Raises:
        HTTPException: If document or file is not found (404 Not Found).
    """
    document = FileService.get_person_document_by_id(
        db=db,
        person_id=person_id,
        document_id=document_id,
        user_id=current_user.id
    )
    
    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )
    
    file_path = FileService.get_file_path(document)
    
    if not os.path.exists(file_path):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File not found on server"
        )
    
    # Get original filename from path
    original_filename = os.path.basename(document.file_path).split("_", 1)[1]
    
    return FileResponse(
        path=file_path,
        filename=original_filename,
        media_type=document.file_type
    )

@router.get("/{document_id}", response_model=DocumentSchema)
def get_document(
    *,
    db: Session = Depends(get_db),
    document_id: int,
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """Retrieve a specific document by its ID.

    Args:
        db (Session): Database session.
        document_id (int): ID of the document to retrieve.
        current_user (User): Currently authenticated user.

    Returns:
        DocumentSchema: The requested document object.

    Raises:
        HTTPException: If document is not found (404 Not Found).
    """
    document = FileService.get_document_by_id(
        db=db,
        document_id=document_id,
        user_id=current_user.id
    )
    
    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )
    
    return document

@router.get("/{person_id}/{document_id}", response_model=DocumentSchema)
def get_person_document(
    *,
    db: Session = Depends(get_db),
    person_id: int,
    document_id: int,
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """Retrieve a specific document connected to a person.

    Args:
        db (Session): Database session.
        person_id (int): ID of the person connected to the document.
        document_id (int): ID of the document to retrieve.
        current_user (User): Currently authenticated user.

    Returns:
        DocumentSchema: The requested document object.

    Raises:
        HTTPException: If document is not found (404 Not Found).
    """
    document = FileService.get_person_document_by_id(
        db=db,
        person_id=person_id,
        document_id=document_id,
        user_id=current_user.id
    )
    
    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )
    
    return document

@router.put("/{document_id}", response_model=DocumentSchema)
def update_document(
    *,
    db: Session = Depends(get_db),
    document_id: int,
    document_in: DocumentUpdate,
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """Update the metadata of an existing document.

    Args:
        db (Session): Database session.
        document_id (int): ID of the document to update.
        document_in (DocumentUpdate): Updated document data.
        current_user (User): Currently authenticated user.

    Returns:
        DocumentSchema: The updated document object.

    Raises:
        HTTPException: If document is not found (404 Not Found).
    """
    document = FileService.get_document_by_id(
        db=db,
        document_id=document_id,
        user_id=current_user.id
    )
    
    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )
    
    # Update fields
    for field, value in document_in.model_dump(exclude_unset=True).items():
        setattr(document, field, value)
    
    db.add(document)
    db.commit()
    db.refresh(document)
    
    return document

@router.delete("/{document_id}")
def delete_document(
    *,
    db: Session = Depends(get_db),
    document_id: int,
    current_user: User = Depends(get_current_active_user),
    response: Response
) -> None:
    """Delete a document and its associated file.

    Args:
        db (Session): Database session.
        document_id (int): ID of the document to delete.
        current_user (User): Currently authenticated user.
        response (Response): FastAPI response object.

    Raises:
        HTTPException: If document is not found (404 Not Found).
    """
    document = FileService.get_document_by_id(
        db=db,
        document_id=document_id,
        user_id=current_user.id
    )
    
    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )
    
    # Delete file from filesystem
    FileService.delete_file(document)
    
    # Delete document from database
    db.delete(document)
    db.commit()
    
    # Set the response status code to 204 No Content
    response.status_code = status.HTTP_204_NO_CONTENT
    return None
