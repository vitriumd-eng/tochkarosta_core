"""
Subscription Service - Subscription management
Uses SQLAlchemy ORM for all database operations
"""
from typing import Optional
from datetime import datetime, timedelta
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from app.models.subscription import Subscription
from app.models.tenant import Tenant
from app.models.module_settings import ModuleSettings
from app.db.session import AsyncSessionLocal
import uuid
import logging

logger = logging.getLogger(__name__)


class SubscriptionService:
    """Subscription management service"""
    
    async def get_trial_days_for_module(self, module_id: str, db: Optional[AsyncSession] = None) -> int:
        """Get trial days for module from module_settings"""
        if db is None:
            async with AsyncSessionLocal() as session:
                return await self.get_trial_days_for_module(module_id, session)
        
        stmt = select(ModuleSettings).where(ModuleSettings.module_id == module_id)
        result = await db.execute(stmt)
        settings = result.scalar_one_or_none()
        
        if settings:
            return settings.trial_days
        
        # Default trial days if not configured
        return 14
    
    async def create_trial_subscription(
        self,
        tenant_id: uuid.UUID,
        module_id: str
    ) -> Subscription:
        """
        Create trial subscription for module.
        Trial duration is taken from module_settings.
        """
        async with AsyncSessionLocal() as db:
            # Get trial days for module
            trial_days = await self.get_trial_days_for_module(module_id, db)
            
            # Calculate expires_at
            started_at = datetime.utcnow()
            expires_at = started_at + timedelta(days=trial_days)
            
            # Create subscription
            new_subscription = Subscription(
                tenant_id=tenant_id,
                plan=None,  # NULL for trial
                status="trial",
                started_at=started_at,
                expires_at=expires_at,
                trial_used=True
            )
            db.add(new_subscription)
            
            # Update tenant status to active
            tenant_stmt = select(Tenant).where(Tenant.id == tenant_id)
            tenant_result = await db.execute(tenant_stmt)
            tenant = tenant_result.scalar_one_or_none()
            
            if not tenant:
                raise ValueError(f"Tenant not found: {tenant_id}")
            
            tenant.status = "active"
            
            try:
                await db.flush()
                await db.refresh(new_subscription)
                logger.info(f"Created trial subscription {new_subscription.id} for tenant {tenant_id}")
                return new_subscription
            except IntegrityError as e:
                await db.rollback()
                raise ValueError(f"Failed to create trial subscription: {e}") from e
    
    async def create_subscription(
        self,
        tenant_id: uuid.UUID,
        plan: str,
        trial: bool = False
    ) -> Subscription:
        """Create new subscription (for paid plans)"""
        async with AsyncSessionLocal() as db:
            # Calculate expires_at based on plan
            started_at = datetime.utcnow()
            expires_at = started_at + timedelta(days=30)  # Paid: 30 days from now
            
            # Create subscription
            new_subscription = Subscription(
                tenant_id=tenant_id,
                plan=plan,
                status="active",
                started_at=started_at,
                expires_at=expires_at,
                trial_used=trial
            )
            db.add(new_subscription)
            
            # Update tenant plan and status
            tenant_stmt = select(Tenant).where(Tenant.id == tenant_id)
            tenant_result = await db.execute(tenant_stmt)
            tenant = tenant_result.scalar_one_or_none()
            
            if not tenant:
                raise ValueError(f"Tenant not found: {tenant_id}")
            
            tenant.plan = plan
            tenant.status = "active"
            
            try:
                await db.flush()
                await db.refresh(new_subscription)
                logger.info(f"Created subscription {new_subscription.id} for tenant {tenant_id}, plan: {plan}")
                return new_subscription
            except IntegrityError as e:
                await db.rollback()
                raise ValueError(f"Failed to create subscription: {e}") from e


