from fastapi import APIRouter

from api.routes import auth, documents

router = APIRouter()
router.include_router(auth.router, prefix="/auth", tags=["auth"])
router.include_router(documents.router, prefix="/documents", tags=["documents"])

# Once implemented, uncomment the following routers
# from api.routes import metadata, people, relationships, visualization
# router.include_router(metadata.router, prefix="/documents/{document_id}/metadata", tags=["metadata"])
# router.include_router(people.router, prefix="/people", tags=["people"])
# router.include_router(relationships.router, prefix="/relationships", tags=["relationships"])
# router.include_router(visualization.router, prefix="/visualization", tags=["visualization"])