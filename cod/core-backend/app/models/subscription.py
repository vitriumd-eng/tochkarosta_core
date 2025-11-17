"""
Subscription SQLAlchemy Model
"""
from sqlalchemy import Column, String, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime
from typing import Optional
from app.db.base import Base


class Subscription(Base):
    """Subscription SQLAlchemy model"""
    __tablename__ = "subscriptions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False)
    plan = Column(Text, nullable=True)  # NULL for trial subscriptions
    status = Column(Text, nullable=False)
    started_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)
    expires_at = Column(DateTime(timezone=True), nullable=True)
    trial_used = Column(Boolean, default=False, nullable=False)

    # Relationships
    tenant = relationship("Tenant", back_populates="subscriptions")

    def __repr__(self):
        return f"<Subscription(id={self.id}, tenant_id={self.tenant_id}, status={self.status})>"


