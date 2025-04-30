# app/backend/api/routes/visualization.py

from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from api.dependencies import get_current_active_user
from db.session import get_db
from models.user import User
from services.file_service import FileService
from schemas.document import DocumentVisualize

router = APIRouter()

@router.get("/", response_model=List[DocumentVisualize])
def get_visualization_data(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Returns a list of the user's documents, suitable for "vine" visualization.
    Now includes file_type, file_size, and created_at for frontend modal image preview and details.
    """
    # 1) Query the documents for the current user
    documents = FileService.get_documents_for_user(db, user_id=current_user.id)

    # 2) raise a 404 when the user has no docs:
    if not documents:
        raise HTTPException(status_code=404, detail="No visualization data found.")

    return documents