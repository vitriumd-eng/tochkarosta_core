"""
Product Service
Business logic for products (no core dependencies)
"""
from uuid import UUID
from app.domain.entities.product import Product


class ProductService:
    """Product business logic service"""
    
    def validate_product(self, product: Product) -> bool:
        """Validate product data"""
        if not product.name or len(product.name) < 3:
            return False
        if product.price <= 0:
            return False
        return True
    
    def calculate_discount_price(self, product: Product, discount_percent: float) -> float:
        """Calculate price with discount"""
        return product.price * (1 - discount_percent / 100)



