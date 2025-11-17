"""
Product Model - SQLAlchemy
Module uses its own DB per tenant (via SDK)
"""
from sqlalchemy import Column, String, Integer, Float, Text, Boolean, DateTime
from sqlalchemy.orm import declarative_base
from datetime import datetime

# Import Base from module's db session
from ..db.session import Base


class Product(Base):
    """Product model for shop module"""
    __tablename__ = "products"
    
    id = Column(String, primary_key=True)
    tenant_id = Column(String, nullable=False, index=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    price = Column(Float, nullable=False)
    stock = Column(Integer, default=0)
    sku = Column(String, unique=True, index=True)
    image_url = Column(String)
    active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "price": self.price,
            "stock": self.stock,
            "sku": self.sku,
            "image_url": self.image_url,
            "active": self.active
        }



