"""
Deleted Accounts History SQLAlchemy Model
"""
from sqlalchemy import Column, String, Text, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime
from typing import Optional
from app.db.base import Base


class DeletedAccountsHistory(Base):
    """Deleted Accounts History SQLAlchemy model"""
    __tablename__ = "deleted_accounts_history"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    phone = Column(String(20), nullable=False)
    tenant_id = Column(UUID(as_uuid=True), nullable=True)
    deleted_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)
    reason = Column(Text, nullable=True)

    def __repr__(self):
        return f"<DeletedAccountsHistory(phone={self.phone}, deleted_at={self.deleted_at})>"

