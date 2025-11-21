from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from app.core.database import get_db
from app.modules.billing.schemas import (
    TariffResponse, 
    SubscriptionResponse, 
    SubscriptionCreateRequest
)
from app.modules.billing.models import Tariff, Subscription
from app.models.tenant import Tenant
import uuid

router = APIRouter()

@router.get("/tariffs", response_model=List[TariffResponse])
async def list_tariffs(
    active_only: bool = True,
    db: AsyncSession = Depends(get_db)
):
    """List all available tariffs"""
    query = select(Tariff).where(Tariff.is_deleted == False)
    if active_only:
        query = query.where(Tariff.is_active == True)
    
    result = await db.execute(query)
    tariffs = result.scalars().all()
    return tariffs

@router.get("/tariffs/{tariff_id}", response_model=TariffResponse)
async def get_tariff(
    tariff_id: uuid.UUID,
    db: AsyncSession = Depends(get_db)
):
    """Get tariff by ID"""
    result = await db.execute(
        select(Tariff).where(Tariff.id == tariff_id, Tariff.is_deleted == False)
    )
    tariff = result.scalar_one_or_none()
    
    if not tariff:
        raise HTTPException(status_code=404, detail="Tariff not found")
    
    return tariff

@router.get("/subscriptions/{tenant_id}", response_model=SubscriptionResponse)
async def get_subscription(
    tenant_id: uuid.UUID,
    db: AsyncSession = Depends(get_db)
):
    """Get subscription for a tenant"""
    result = await db.execute(
        select(Subscription)
        .where(Subscription.tenant_id == tenant_id, Subscription.is_deleted == False)
        .order_by(Subscription.created_at.desc())
    )
    subscription = result.scalar_one_or_none()
    
    if not subscription:
        raise HTTPException(status_code=404, detail="Subscription not found")
    
    return subscription

@router.post("/subscriptions", response_model=SubscriptionResponse)
async def create_subscription(
    data: SubscriptionCreateRequest,
    db: AsyncSession = Depends(get_db)
):
    """Create a new subscription"""
    # Check if tenant exists
    tenant_result = await db.execute(
        select(Tenant).where(Tenant.id == data.tenant_id)
    )
    tenant = tenant_result.scalar_one_or_none()
    if not tenant:
        raise HTTPException(status_code=404, detail="Tenant not found")
    
    # Check if tariff exists
    tariff_result = await db.execute(
        select(Tariff).where(Tariff.id == data.tariff_id, Tariff.is_active == True)
    )
    tariff = tariff_result.scalar_one_or_none()
    if not tariff:
        raise HTTPException(status_code=404, detail="Tariff not found")
    
    # Create subscription
    new_subscription = Subscription(
        tenant_id=data.tenant_id,
        tariff_id=data.tariff_id,
        is_active=True
    )
    db.add(new_subscription)
    await db.commit()
    await db.refresh(new_subscription)
    
    return new_subscription

