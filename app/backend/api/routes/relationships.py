"""
FastAPI router for managing relationships between people in a family tree.

This module provides endpoints for creating, reading, updating, and deleting
relationships between people. All operations are scoped to the currently
authenticated user.
"""

from typing import List, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from db.session import get_db
from models.relationship import Relationship
from models.person import Person
from schemas.relationship import (
    Relationship as RelationshipSchema,
    RelationshipCreate,
    RelationshipUpdate,
    RelationshipWithPersons,
)
from api.dependencies import get_current_active_user
from models.user import User

router = APIRouter()


@router.post("/", response_model=RelationshipSchema)
def create_relationship(
    *,
    db: Session = Depends(get_db),
    relationship_in: RelationshipCreate,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Create a new relationship between two people owned by the current user.

    Args:
        db: Database session.
        relationship_in: Relationship data to create.
        current_user: Currently authenticated user.

    Returns:
        The created relationship.

    Raises:
        HTTPException: If one or both people are not found or don't belong to the user.
    """
    # both persons exist and belong to the user
    person_1 = db.query(Person).filter(Person.id == relationship_in.person_id_1, Person.user_id == current_user.id).first()
    person_2 = db.query(Person).filter(Person.id == relationship_in.person_id_2, Person.user_id == current_user.id).first()

    if not person_1 or not person_2:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="One or both people not found or access denied",
        )

    relationship = Relationship(
        person_id_1=relationship_in.person_id_1,
        person_id_2=relationship_in.person_id_2,
        relationship_type=relationship_in.relationship_type,
        user_id=current_user.id,
    )
    db.add(relationship)
    db.commit()
    db.refresh(relationship)

    return relationship


@router.get("/", response_model=List[RelationshipWithPersons])
def get_relationships(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Get all relationships associated with the current user.

    Args:
        db: Database session.
        skip: Number of records to skip (for pagination).
        limit: Maximum number of records to return (for pagination).
        current_user: Currently authenticated user.

    Returns:
        A list of relationships with associated person details.
    """
    relationships = (
        db.query(Relationship).filter(Relationship.user_id == current_user.id).offset(skip).limit(limit).all()
    )
    return relationships


@router.get("/{relationship_id}", response_model=RelationshipWithPersons)
def get_relationship(
    *,
    db: Session = Depends(get_db),
    relationship_id: int,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Get a specific relationship by ID if owned by the current user.

    Args:
        db: Database session.
        relationship_id: ID of the relationship to retrieve.
        current_user: Currently authenticated user.

    Returns:
        The requested relationship with associated person details.

    Raises:
        HTTPException: If the relationship is not found or doesn't belong to the user.
    """
    relationship = (
        db.query(Relationship).filter(Relationship.id == relationship_id, Relationship.user_id == current_user.id).first()
    )

    if not relationship:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Relationship not found or access denied",
        )

    return relationship


@router.put("/{relationship_id}", response_model=RelationshipSchema)
def update_relationship(
    *,
    db: Session = Depends(get_db),
    relationship_id: int,
    relationship_in: RelationshipUpdate,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Update a relationship if owned by the current user.

    Args:
        db: Database session.
        relationship_id: ID of the relationship to update.
        relationship_in: Updated relationship data.
        current_user: Currently authenticated user.

    Returns:
        The updated relationship.

    Raises:
        HTTPException: If the relationship is not found or doesn't belong to the user.
    """
    relationship = (
        db.query(Relationship).filter(Relationship.id == relationship_id, Relationship.user_id == current_user.id).first()
    )

    if not relationship:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Relationship not found or access denied",
        )

    for field, value in relationship_in.model_dump(exclude_unset=True).items():
        setattr(relationship, field, value)

    db.add(relationship)
    db.commit()
    db.refresh(relationship)

    return relationship


@router.delete("/{relationship_id}")
def delete_relationship(
    *,
    db: Session = Depends(get_db),
    relationship_id: int,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Delete a relationship if owned by the current user.

    Args:
        db: Database session.
        relationship_id: ID of the relationship to delete.
        current_user: Currently authenticated user.

    Returns:
        A message confirming the deletion.

    Raises:
        HTTPException: If the relationship is not found or doesn't belong to the user.
    """
    relationship = (
        db.query(Relationship).filter(Relationship.id == relationship_id, Relationship.user_id == current_user.id).first()
    )

    if not relationship:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Relationship not found or access denied",
        )

    db.delete(relationship)
    db.commit()

    return {"message": f"Relationship {relationship.id} has been deleted"}
