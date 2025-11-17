"""
Product Entity
Domain entity for product
"""
from dataclasses import dataclass
from datetime import datetime
from uuid import UUID


@dataclass
class Product:
    """Product domain entity"""
    id: UUID
    tenant_id: UUID
    name: str
    price: float
    description: str
    category: str
    image_url: str
    in_stock: bool
    created_at: datetime
    updated_at: datetime



