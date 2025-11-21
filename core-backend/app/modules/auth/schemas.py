from pydantic import BaseModel, Field
from typing import Optional, Literal

class CheckPhoneRequest(BaseModel):
    phone: str

class CheckPhoneResponse(BaseModel):
    exists: bool

class SendCodeRequest(BaseModel):
    phone: str
    provider: str = "telegram"

class LoginPasswordRequest(BaseModel):
    phone: str
    password: str

class CompleteRegistrationRequest(BaseModel):
    phone: str
    code: str | None = None  # OTP for verification only (optional)
    password: str   # Set password
    first_name: str
    last_name: str
    employment_type: Literal["individual", "self_employed", "ip", "ooo"]

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: Optional[str] = None
    token_type: str = "bearer"
    user_id: str
    tenant_id: Optional[str] = None
    is_new_user: bool = False