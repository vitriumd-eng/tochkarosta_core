"""
Dashboard API endpoints
For subscriber dashboard
"""
from fastapi import APIRouter

router = APIRouter()


@router.get("/stats")
async def get_stats():
    """Get dashboard statistics"""
    return {"stats": {}}


@router.get("/products")
async def list_products():
    """List products for management"""
    return {"products": []}



