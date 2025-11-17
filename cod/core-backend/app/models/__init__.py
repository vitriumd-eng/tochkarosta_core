"""
Models package
Import all models to ensure SQLAlchemy can resolve relationships
"""
from app.models.user import User
from app.models.tenant import Tenant
from app.models.subscription import Subscription
from app.models.tenant_domain import TenantDomain
from app.models.platform_content import PlatformContent
from app.models.module_settings import ModuleSettings
from app.models.deleted_accounts_history import DeletedAccountsHistory

__all__ = [
    "User",
    "Tenant",
    "Subscription",
    "TenantDomain",
    "PlatformContent",
    "ModuleSettings",
    "DeletedAccountsHistory",
]
