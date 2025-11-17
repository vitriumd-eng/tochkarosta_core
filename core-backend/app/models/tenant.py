"""
Tenant SQLAlchemy Model
"""
from __future__ import annotations
from sqlalchemy import Column, String, Text, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime
from typing import TYPE_CHECKING
from app.db.base import Base

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.subscription import Subscription
    from app.models.tenant_domain import TenantDomain


class Tenant(Base):
    """Tenant SQLAlchemy model"""
    __tablename__ = "tenants"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(Text, nullable=False)
    owner_phone = Column(String(20), nullable=False)
    plan = Column(Text, nullable=True)  # NULL until module is activated
    status = Column(Text, default="inactive", nullable=False)  # inactive until module is activated
    active_module = Column(Text, nullable=True)  # NULL until module is selected
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)

    # Relationships
    users = relationship("User", back_populates="tenant", cascade="all, delete-orphan")
    subscriptions = relationship("Subscription", back_populates="tenant", cascade="all, delete-orphan")
    domains = relationship("TenantDomain", back_populates="tenant", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Tenant(id={self.id}, name={self.name}, status={self.status})>"


