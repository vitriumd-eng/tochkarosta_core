"""
Модели данных для модуля

ВАЖНО: Все модели должны содержать tenant_id для изоляции данных
"""
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from typing import Optional
import uuid

# Импортируйте базовые классы из вашей БД настройки
# from app.core.db import Base, TimestampMixin

# Пример модели (раскомментируйте и адаптируйте под ваши нужды)
"""
class ModuleItem(Base, TimestampMixin):
    __tablename__ = "module_items"
    
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )
    
    # КРИТИЧЕСКИ ВАЖНО: tenant_id для изоляции данных
    tenant_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("tenants.id"),  # Ссылка на Core, но БД модуля изолирована
        nullable=False,
        index=True
    )
    
    # Ваши поля модуля
    name: Mapped[str] = mapped_column(String, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    
    # Индексы для производительности
    __table_args__ = (
        {"comment": "Items for module"}
    )
"""



