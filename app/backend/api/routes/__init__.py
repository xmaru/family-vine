# Import routers
from api.routes.auth import router as auth_router
from api.routes.documents import router as documents_router

# Define the routers for main.py to import
auth = auth_router
documents = documents_router

# Once implemented, uncomment the following imports
# from api.routes.metadata import router as metadata_router
# from api.routes.people import router as people_router
# from api.routes.relationships import router as relationships_router
# from api.routes.visualization import router as visualization_router
# 
# metadata = metadata_router
# people = people_router
# relationships = relationships_router
# visualization = visualization_router