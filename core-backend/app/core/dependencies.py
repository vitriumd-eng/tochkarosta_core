"""
Dependencies для FastAPI endpoints
Переиспользуемые зависимости для удобства
"""
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.middleware.auth import (
    get_current_user,
    get_current_tenant_id,
    get_superuser,
    get_owner_or_superuser
)
from app.models.user import User
import uuid

# Database dependency
DatabaseDep = Depends(get_db)

# Auth dependencies
CurrentUser = Depends(get_current_user)
CurrentTenant = Depends(get_current_tenant_id)
Superuser = Depends(get_superuser)
OwnerOrSuperuser = Depends(get_owner_or_superuser)

# Type aliases for better IDE support
UserDep = Depends(get_current_user)
TenantIdDep = Depends(get_current_tenant_id)
SuperuserDep = Depends(get_superuser)







