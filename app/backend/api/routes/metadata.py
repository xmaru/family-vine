from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from api.dependencies import get_current_active_user
from db.session import get_db
from models.document import Document
from models.user import User
from models.metadata import Metadata
from schemas.metadata import Metadata as MetadataSchema, MetadataCreate, MetadataUpdate

router = APIRouter()


@router.post("/{document_id}", response_model=MetadataSchema)
def create_metadata(
    *,
    db: Session = Depends(get_db),
    document_id: int,
    metadata_in: MetadataCreate,
    current_user: User = Depends(get_current_active_user)  # Use in routes where we want to restrict metadata access to only documents the user owns
) -> Any:
    """
    Create metadata for a document where the document belongs to the current user.
    """
    document = db.query(Document).filter(Document.id == document_id, Document.user_id == current_user.id).first()
    if not document:
        raise HTTPException(status_code=403, detail="Not authorized to modify this document")

    existing_metadata = db.query(Metadata).filter(Metadata.document_id == document_id).first()
    if existing_metadata:
        raise HTTPException(status_code=400, detail="Metadata already exists for this document")

    metadata = Metadata(**metadata_in.model_dump(), document_id=document_id)
    
    db.add(metadata)
    db.commit()
    db.refresh(metadata)
    
    return metadata

@router.get("/{document_id}", response_model=MetadataSchema)
def get_metadata(
    *,
    db: Session = Depends(get_db),
    document_id: int,
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Retrieve metadata for a document where the document belongs to the current user.
    """
    document = db.query(Document).filter(Document.id == document_id, Document.user_id == current_user.id).first()
    if not document:
        raise HTTPException(status_code=403, detail="Not authorized to access this document")

    metadata = db.query(Metadata).filter(Metadata.document_id == document_id).first()
    if not metadata:
        raise HTTPException(status_code=404, detail="Metadata not found")

    return metadata

@router.put("/{document_id}", response_model=MetadataSchema)
def update_metadata(
    *,
    db: Session = Depends(get_db),
    document_id: int,
    metadata_in: MetadataUpdate,
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Update metadata for a document where the document belongs to the current user.
    """
    document = db.query(Document).filter(Document.id == document_id, Document.user_id == current_user.id).first()
    if not document:
        raise HTTPException(status_code=403, detail="Not authorized to modify this document")

    metadata = db.query(Metadata).filter(Metadata.document_id == document_id).first()
    if not metadata:
        raise HTTPException(status_code=404, detail="Metadata not found")

    # Update fields
    for field, value in metadata_in.model_dump(exclude_unset=True).items():
        setattr(metadata, field, value)

    db.commit()
    db.refresh(metadata)

    return metadata

@router.delete("/{document_id}")
def delete_metadata(
    *,
    db: Session = Depends(get_db),
    document_id: int,
    current_user: User = Depends(get_current_active_user)
) -> None:
    """
    Delete metadata for a document where the document belongs to the current user.
    """
    document = db.query(Document).filter(Document.id == document_id, Document.user_id == current_user.id).first()
    if not document:
        raise HTTPException(status_code=403, detail="Not authorized to delete this document's metadata")

    metadata = db.query(Metadata).filter(Metadata.document_id == document_id).first()
    if not metadata:
        raise HTTPException(status_code=404, detail="Metadata not found")

    db.delete(metadata)
    db.commit()

    return {"detail": "Metadata deleted successfully"}
