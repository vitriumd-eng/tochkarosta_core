"""
Platform Content SQLAlchemy Model
"""
from sqlalchemy import Column, String, Text, DateTime, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime
from typing import Optional, Dict, Any
from app.db.base import Base


class PlatformContent(Base):
    """Platform Content SQLAlchemy model"""
    __tablename__ = "platform_content"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    key = Column(Text, unique=True, nullable=False)
    content = Column(JSONB, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)
    updated_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)

    # Relationships
    updated_by_user = relationship("User", foreign_keys=[updated_by])

    def __repr__(self):
        return f"<PlatformContent(key={self.key}, updated_at={self.updated_at})>"


