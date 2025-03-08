from typing import List, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from db.session import get_db
from models.person import Person
from schemas.person import Person as PersonSchema, PersonCreate, PersonUpdate
from api.dependencies import get_current_active_user
from models.user import User

router = APIRouter()

@router.post("/", response_model=PersonSchema)
def create_person(
    *,
    db: Session = Depends(get_db),
    person_in: PersonCreate,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Create a new person associated with the current user.
    """
    person = Person(
        name=person_in.name,
        birthday=person_in.birthday,
        description=person_in.description,
        user_id=current_user.id
    )
    db.add(person)
    db.commit()
    db.refresh(person)
    return person

@router.get("/", response_model=List[PersonSchema])
def get_people(
    *,
    db: Session = Depends(get_db),
    skip: int = 0, # Skips the first specified # of rows in the database query.
    limit: int = 100, # Limits the result set to specified # of rows.
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Retrieve a list of people associated with the current user.
    """
    people = db.query(Person).filter(Person.user_id == current_user.id).offset(skip).limit(limit).all()
    return people

@router.get("/{person_id}", response_model=PersonSchema)
def get_person(
    *,
    db: Session = Depends(get_db),
    person_id: int,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Retrieve a specific person by ID if owned by the current user.
    """
    person = db.query(Person).filter(Person.id == person_id, Person.user_id == current_user.id).first()

    if not person:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Person not found or access denied",
        )

    return person

@router.put("/{person_id}", response_model=PersonSchema)
def update_person(
    *,
    db: Session = Depends(get_db),
    person_id: int,
    person_in: PersonUpdate,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Update a person if owned by the current user.
    """
    person = db.query(Person).filter(Person.id == person_id, Person.user_id == current_user.id).first()

    if not person:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Person not found or access denied",
        )

    for field, value in person_in.model_dump(exclude_unset=True).items():
        setattr(person, field, value)

    db.add(person)
    db.commit()
    db.refresh(person)

    return person

@router.delete("/{person_id}")
def delete_person(
    *,
    db: Session = Depends(get_db),
    person_id: int,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Delete a person if owned by the current user.
    """
    person = db.query(Person).filter(Person.id == person_id, Person.user_id == current_user.id).first()

    if not person:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Person not found or access denied",
        )

    db.delete(person)
    db.commit()

    return {"message": f"Person {person.name} has been deleted"}
