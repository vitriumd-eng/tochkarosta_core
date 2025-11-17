"""
Tenant Pydantic Schemas
"""
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
import uuid


class TenantCreate(BaseModel):
    """Schema for creating a new tenant"""
    owner_id: uuid.UUID = Field(..., description="Tenant owner user ID")
    name: str = Field(..., min_length=1, max_length=255, description="Tenant name")


class TenantResponse(BaseModel):
    """Schema for tenant response"""
    id: uuid.UUID
    name: str
    owner_phone: str
    plan: Optional[str]
    status: str
    active_module: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True


class TenantUpdate(BaseModel):
    """Schema for updating tenant"""
    name: Optional[str] = Field(None, min_length=1, max_length=255, description="Tenant name")
    plan: Optional[str] = Field(None, description="Tenant plan")
    status: Optional[str] = Field(None, description="Tenant status")
    active_module: Optional[str] = Field(None, description="Active module ID")





