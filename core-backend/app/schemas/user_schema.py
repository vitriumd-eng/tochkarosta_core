"""
User Schema (Legacy - use app.schemas.user instead)
Re-exported for backward compatibility
"""
# Re-export from new location for backward compatibility
from app.schemas.user import (
    UserCreate,
    UserResponse,
    PlatformMasterCreate,
)

__all__ = ["UserCreate", "UserResponse", "PlatformMasterCreate"]
