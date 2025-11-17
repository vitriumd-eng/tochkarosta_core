"""
Tenant Domain SQLAlchemy Model
"""
from sqlalchemy import Column, String, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime
from typing import Optional
from app.db.base import Base


class TenantDomain(Base):
    """Tenant Domain SQLAlchemy model"""
    __tablename__ = "tenant_domains"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False)
    domain = Column(Text, unique=True, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    is_frozen = Column(Boolean, default=False, nullable=False)
    frozen_until = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)

    # Relationships
    tenant = relationship("Tenant", back_populates="domains")

    def __repr__(self):
        return f"<TenantDomain(domain={self.domain}, tenant_id={self.tenant_id}, is_active={self.is_active})>"

