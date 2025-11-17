"""
Internal API - Core-to-module communication
"""
from fastapi import APIRouter
from .register import router as register_router

router = APIRouter()
router.include_router(register_router, prefix="/register", tags=["internal"])


