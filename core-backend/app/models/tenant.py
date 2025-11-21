from __future__ import annotations
from typing import TYPE_CHECKING, List
import uuid
from sqlalchemy import String, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.db import Base, TimestampMixin, SoftDeleteMixin

if TYPE_CHECKING:
    from app.models.user import User
    from app.modules.billing.models import Subscription

class Tenant(Base, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "tenants"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String, index=True) 
    
    # Critical for Gateway
    domain: Mapped[str] = mapped_column(String, unique=True, index=True, nullable=False)
    owner_phone: Mapped[str] = mapped_column(String(20))
    
    status: Mapped[str] = mapped_column(String(20), default="active")
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    
    users: Mapped[List["User"]] = relationship("User", back_populates="tenant")
    subscription: Mapped["Subscription"] = relationship("Subscription", back_populates="tenant", uselist=False)