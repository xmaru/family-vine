# app/backend/services/visualization_service.py

from typing import List, Dict, Any
from sqlalchemy.orm import Session
from datetime import datetime

from models.document import Document  # Make sure this import matches your project

class VisualizationService:
    @staticmethod
    def get_vine_data(db: Session, user_id: int) -> List[Dict[str, Any]]:
        """
        Queries the Document table for a given user and returns a list of
        dictionaries containing date, title, ID, etc., sorted by created_at ascending.
        """
        # Filter for documents owned by the given user, sorted by created_at ascending
        docs = (
            db.query(Document)
            .filter(Document.user_id == user_id)
            .order_by(Document.created_at.asc())
            .all()
        )

        vine_data = []
        for doc in docs:
            # Format the created_at datetime as "YYYY-MM-DD" or fallback
            date_str = "Unknown"
            if doc.created_at:
                date_str = doc.created_at.strftime("%Y-%m-%d")
            
            vine_data.append({
                "id": doc.id,
                "title": doc.title,
                "type": doc.file_type or "",
                "created_at": date_str
            })

        return vine_data