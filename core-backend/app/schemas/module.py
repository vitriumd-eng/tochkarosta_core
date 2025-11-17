"""
Module Pydantic Schemas
"""
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
import uuid


class ModuleResponse(BaseModel):
    """Schema for module response"""
    id: uuid.UUID
    module_id: str
    version: str
    path: str
    dependencies: List[str]
    is_active: bool
    created_at: Optional[datetime]
    
    class Config:
        from_attributes = True


class ModuleListResponse(BaseModel):
    """Schema for module list response"""
    modules: List[ModuleResponse]
    total: int


class ModuleSwitchRequest(BaseModel):
    """Schema for switching tenant active module"""
    module_id: str = Field(..., description="Module ID to activate")


class ModuleSwitchResponse(BaseModel):
    """Schema for module switch response"""
    tenant_id: uuid.UUID
    active_module: str
    status: str





