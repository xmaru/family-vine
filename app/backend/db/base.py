from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

# Import all models here to ensure they are registered with SQLAlchemy
from models.user import User
from models.document import Document
from models.metadata import Metadata
from models.person import Person