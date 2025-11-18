"""
User External Account SQLAlchemy Model
Stores external authentication accounts (Telegram, MAX, etc.)
"""
from __future__ import annotations
from sqlalchemy import Column, String, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime
from typing import TYPE_CHECKING
from app.db.base import Base

if TYPE_CHECKING:
    from app.models.user import User


class UserExternalAccount(Base):
    """User External Account SQLAlchemy model for OAuth providers"""
    __tablename__ = "user_external_accounts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    provider = Column(String(50), nullable=False)  # 'telegram', 'max', etc.
    external_id = Column(String(255), nullable=False)  # External provider user ID
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)

    # Relationships
    user = relationship("User", backref="external_accounts")

    # Unique constraint: one external account per provider+external_id
    __table_args__ = (
        UniqueConstraint('provider', 'external_id', name='uq_provider_external_id'),
    )

    def __repr__(self):
        return f"<UserExternalAccount(id={self.id}, provider={self.provider}, external_id={self.external_id})>"

