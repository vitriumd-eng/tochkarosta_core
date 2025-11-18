# ПРИМЕР: app/api/v1/schemas/external_auth.py
from pydantic import BaseModel
from typing import Optional

class ExternalAuthRequest(BaseModel):
    provider: str
    external_id: str
    username: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    signature: str

class AuthResponse(BaseModel):
    access_token: str
    refresh_token: str
    tenant_id: str
    user_id: str
