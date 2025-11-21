import uuid
from datetime import datetime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Integer, Float, Boolean, ForeignKey, DateTime, func
from sqlalchemy.dialects.postgresql import UUID
from typing import List, TYPE_CHECKING, Optional
from app.core.db import Base, TimestampMixin, SoftDeleteMixin

if TYPE_CHECKING:
    from app.models.tenant import Tenant

class Tariff(Base, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "tariffs"
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String, unique=True, nullable=False) # Base, Growth, Master
    price_monthly: Mapped[float] = mapped_column(Float, nullable=False)
    subdomain_limit: Mapped[int] = mapped_column(Integer, nullable=False) # 1, 2, 10
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    features_json: Mapped[str] = mapped_column(String, nullable=True)

    subscriptions: Mapped[List["Subscription"]] = relationship("Subscription", back_populates="tariff")

class Subscription(Base, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "subscriptions"
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    tenant_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("tenants.id"), nullable=False, index=True) 
    tariff_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("tariffs.id"), nullable=False)
    
    start_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    end_date: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    
    tenant: Mapped["Tenant"] = relationship("Tenant", back_populates="subscription")
    tariff: Mapped["Tariff"] = relationship("Tariff", back_populates="subscriptions")