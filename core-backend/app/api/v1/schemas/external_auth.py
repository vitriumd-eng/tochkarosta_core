"""
OAuth Authentication Schemas
"""
from pydantic import BaseModel
from typing import Optional


class ExternalAuthRequest(BaseModel):
    """Request schema for OAuth external authentication"""
    provider: str
    external_id: str
    username: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    signature: str


class AuthResponse(BaseModel):
    """Response schema for OAuth authentication"""
    access_token: str
    refresh_token: str
    tenant_id: str
    user_id: str
