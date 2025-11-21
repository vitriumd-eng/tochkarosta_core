from __future__ import annotations
from typing import TYPE_CHECKING, Optional
import uuid
from sqlalchemy import String, Boolean, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.db import Base, TimestampMixin, SoftDeleteMixin

if TYPE_CHECKING:
    from app.models.tenant import Tenant

class User(Base, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    # Phone is ID
    phone: Mapped[str] = mapped_column(String(20), unique=True, index=True, nullable=False)
    phone_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    
    # Password (Required for No-SMS flow)
    password_hash: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    
    # Profile
    first_name: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    last_name: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    employment_type: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    
    role: Mapped[str] = mapped_column(String(20), default="subscriber")
    is_superuser: Mapped[bool] = mapped_column(Boolean, default=False)

    # Relationship
    tenant_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("tenants.id"), nullable=True)
    tenant: Mapped["Tenant"] = relationship("Tenant", back_populates="users")