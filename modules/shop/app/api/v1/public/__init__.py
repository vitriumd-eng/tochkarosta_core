"""
Public API endpoints
Used by frontend for public pages
"""
from fastapi import APIRouter

router = APIRouter()


@router.get("/products")
async def list_products():
    """List public products"""
    return {"products": []}


@router.get("/products/{product_id}")
async def get_product(product_id: str):
    """Get product by ID"""
    return {"product": {"id": product_id}}



