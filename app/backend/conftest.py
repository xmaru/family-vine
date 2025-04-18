# conftest.py
import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.pool import StaticPool
from sqlalchemy.orm import sessionmaker

# Ensure all models are imported before create_all() runs
import models.user
import models.person
import models.relationship
import models.metadata

from db.base import Base
from db.session import get_db
from api.routes.person import router as person_router
from api.dependencies import get_current_active_user
from models.user import User as UserModel

# Shared in‑memory SQLite
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,   # ← share one DB across all sessions
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="session")
def db_session():
    # create all tables once
    Base.metadata.create_all(bind=engine)

    session = TestingSessionLocal()
    # seed one test user
    user = UserModel(
        email="test@example.com",
        username="testuser",
        hashed_password="fakehashed",
        is_active=True,
    )
    session.add(user)
    session.commit()
    session.refresh(user)

    yield session

    session.close()
    # drop tables at teardown
    Base.metadata.drop_all(bind=engine)

@pytest.fixture()
def app(db_session):
    app = FastAPI()

    def _get_db():
        yield db_session

    def _get_current_active_user():
        return db_session.query(UserModel).first()

    app.dependency_overrides[get_db] = _get_db
    app.dependency_overrides[get_current_active_user] = _get_current_active_user

    app.include_router(person_router)
    return app

@pytest.fixture()
def client(app):
    return TestClient(app)
