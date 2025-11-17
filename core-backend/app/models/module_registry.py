"""
Module Registry SQLAlchemy Model
"""
from __future__ import annotations
from sqlalchemy import Column, String, Boolean, DateTime, Text
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime
from typing import TYPE_CHECKING, Dict, Any, Optional
from app.db.base import Base

if TYPE_CHECKING:
    pass


class ModuleRegistry(Base):
    """Module Registry SQLAlchemy model"""
    __tablename__ = "modules_registry"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    module_id = Column(Text, unique=True, nullable=False)
    version = Column(Text, nullable=False)
    path = Column(Text, nullable=False)
    dependencies = Column(JSONB, default=list, nullable=True)
    is_active = Column(Boolean, default=True, nullable=True)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=True)

    def __repr__(self):
        return f"<ModuleRegistry(id={self.id}, module_id={self.module_id}, version={self.version}, is_active={self.is_active})>"





