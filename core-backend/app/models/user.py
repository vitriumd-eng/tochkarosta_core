"""
User SQLAlchemy Model
"""
from __future__ import annotations
from sqlalchemy import Column, String, Boolean, Enum as SQLEnum, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime
from typing import TYPE_CHECKING
from app.db.base import Base
from app.models.roles import UserRole

if TYPE_CHECKING:
    from app.models.tenant import Tenant


class User(Base):
    """User SQLAlchemy model"""
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id", ondelete="CASCADE"), nullable=True)
    phone = Column(String(20), unique=True, nullable=False)
    phone_verified = Column(Boolean, default=False, nullable=False)
    password_hash = Column(String, nullable=True)  # For platform_master login/password auth
    # Temporarily use String instead of Enum to avoid database type issues
    # role = Column(SQLEnum(UserRole, values_callable=lambda x: [e.value for e in x]), nullable=True)
    role = Column(String(20), nullable=True)  # Store role as string: 'super_admin', 'platform_master', 'user', 'subscriber', 'buyer'
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)

    # Relationships
    tenant = relationship("Tenant", back_populates="users")

    def __repr__(self):
        return f"<User(id={self.id}, phone={self.phone}, role={self.role})>"


