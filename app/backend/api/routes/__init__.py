# Import routers
from api.routes.auth import router as auth_router
from api.routes.documents import router as documents_router
from api.routes.metadata import router as metadata_router
from api.routes.person import router as person_router
from api.routes.relationships import router as relationship_router

# Define the routers for main.py to import
auth = auth_router
documents = documents_router
metadata = metadata_router
person = person_router
relationship = relationship_router

# Once implemented, uncomment the following imports
# from api.routes.visualization import router as visualization_router
# 
# visualization = visualization_router