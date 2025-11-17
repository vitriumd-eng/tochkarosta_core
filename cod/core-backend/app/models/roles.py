"""
User Roles Enum
"""
import enum


class UserRole(str, enum.Enum):
    """User roles enum"""
    platform_master = "platform_master"
    user = "user"
    admin = "admin"

