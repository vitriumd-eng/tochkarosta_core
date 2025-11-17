"""
Product Schemas - Pydantic schemas for product API
"""
from pydantic import BaseModel, Field
from typing import Optional


class ProductCreate(BaseModel):
    """Schema for creating a product"""
    name: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    price: float = Field(..., gt=0)
    stock: int = Field(default=0, ge=0)
    sku: Optional[str] = None
    image_url: Optional[str] = None


class ProductUpdate(BaseModel):
    """Schema for updating a product"""
    name: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    price: Optional[float] = Field(None, gt=0)
    stock: Optional[int] = Field(None, ge=0)
    sku: Optional[str] = None
    image_url: Optional[str] = None
    active: Optional[bool] = None


class ProductResponse(BaseModel):
    """Schema for product response"""
    id: str
    name: str
    description: Optional[str]
    price: float
    stock: int
    sku: Optional[str]
    image_url: Optional[str]
    active: bool
    
    class Config:
        from_attributes = True

