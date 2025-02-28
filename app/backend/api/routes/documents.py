from typing import List, Any
import os
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from api.dependencies import get_current_active_user
from db.session import get_db
from models.user import User
from models.document import Document
from schemas.document import Document as DocumentSchema, DocumentCreate, DocumentUpdate, DocumentWithDownloadUrl
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
    """
    Upload a new document
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

@router.get("/", response_model=List[DocumentSchema])
def get_documents(
    *,
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Get all documents for the current user
    """
    documents = FileService.get_documents_for_user(
        db=db,
        user_id=current_user.id,
        skip=skip,
        limit=limit
    )
    
    return documents

@router.get("/{document_id}", response_model=DocumentSchema)
def get_document(
    *,
    db: Session = Depends(get_db),
    document_id: int,
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Get document by ID
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

@router.put("/{document_id}", response_model=DocumentSchema)
def update_document(
    *,
    db: Session = Depends(get_db),
    document_id: int,
    document_in: DocumentUpdate,
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Update document metadata
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
    for field, value in document_in.dict(exclude_unset=True).items():
        setattr(document, field, value)
    
    db.add(document)
    db.commit()
    db.refresh(document)
    
    return document

@router.delete("/{document_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_document(
    *,
    db: Session = Depends(get_db),
    document_id: int,
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Delete document
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
    
    return None

@router.get("/{document_id}/download")
def download_document(
    *,
    db: Session = Depends(get_db),
    document_id: int,
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Download document file
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