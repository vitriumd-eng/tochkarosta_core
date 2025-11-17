"""
Account API endpoints
For buyer account management
"""
from fastapi import APIRouter

router = APIRouter()


@router.get("/profile")
async def get_profile():
    """Get buyer profile"""
    return {"profile": {}}


@router.put("/profile")
async def update_profile():
    """Update buyer profile"""
    return {"status": "ok"}



