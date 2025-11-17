"""
FastAPI Dependencies
Common dependencies used across API routes
"""
from app.api.deps.dependencies import (
    get_current_tenant,
    require_platform_master,
)

__all__ = [
    "get_current_tenant",
    "require_platform_master",
]





