"""
Module Settings SQLAlchemy Model
"""
from sqlalchemy import Column, String, Text, Integer, DateTime
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime
from app.db.base import Base


class ModuleSettings(Base):
    """Module Settings SQLAlchemy model"""
    __tablename__ = "module_settings"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    module_id = Column(Text, unique=True, nullable=False)
    trial_days = Column(Integer, default=14, nullable=False)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    def __repr__(self):
        return f"<ModuleSettings(module_id={self.module_id}, trial_days={self.trial_days})>"

