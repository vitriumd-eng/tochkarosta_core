"""
Security Utilities (Legacy - use app.utils.hashing instead)
Password hashing functions - re-exported from app.utils for backward compatibility
"""
# Re-export from utils for backward compatibility
from app.utils.hashing import hash_password, verify_password

__all__ = ["hash_password", "verify_password"]

