"""SQLAlchemy declarative base configuration for the Family Vine application.

This module establishes the SQLAlchemy declarative base and imports all models
to ensure they are properly registered with SQLAlchemy's metadata system.
This centralized import approach prevents circular dependencies and ensures
all models are available when the application initializes the database.
"""

from sqlalchemy.ext.declarative import declarative_base

# Create the declarative base class that all models will inherit from
Base = declarative_base()

# Import all models here to ensure they are registered with SQLAlchemy
# These imports should happen at the module level but we're delaying them
# to avoid circular dependencies

# Import all models here when tables need to be created, not at module load time
def import_all_models():
    # Import models only when needed
    from models.user import User
    from models.document import Document  
    from models.metadata import Metadata
    from models.person import Person