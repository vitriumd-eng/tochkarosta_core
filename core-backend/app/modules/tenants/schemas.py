from pydantic import BaseModel
from typing import Optional
import uuid

class TenantResponse(BaseModel):
    id: uuid.UUID
    name: str
    domain: str
    owner_phone: str
    status: str
    is_active: bool

    class Config:
        from_attributes = True

class TenantCreateRequest(BaseModel):
    name: str
    owner_phone: str

class TenantUpdateRequest(BaseModel):
    name: Optional[str] = None
    status: Optional[str] = None
    is_active: Optional[bool] = None



