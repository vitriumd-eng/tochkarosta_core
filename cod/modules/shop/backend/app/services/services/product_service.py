"""
Product Service - Business logic
Uses SDK for subscription checks
"""
from typing import List, Optional, Dict
import sys
from pathlib import Path

try:
    from app.modules.sdk import get_subscription_status
except ImportError:
    # Fallback for module development
    import sys
    from pathlib import Path
    core_backend_path = Path(__file__).parent.parent.parent.parent / "core-backend"
    if core_backend_path.exists():
        sys.path.insert(0, str(core_backend_path))
        from app.modules.sdk import get_subscription_status


class ProductService:
    """Service for product management"""
    
    @staticmethod
    async def check_product_limit(tenant_id: str, current_count: int) -> Dict:
        """
        Check if tenant can add more products based on subscription
        Uses SDK to get limits
        """
        subscription = await get_subscription_status(tenant_id)
        
        if not subscription.get("active"):
            return {
                "allowed": False,
                "reason": "Subscription not active"
            }
        
        max_products = subscription.get("limits", {}).get("products", 50)
        
        # -1 means unlimited
        if max_products == -1:
            return {"allowed": True, "limit": -1}
        
        if current_count >= max_products:
            return {
                "allowed": False,
                "current": current_count,
                "limit": max_products,
                "reason": f"Product limit reached ({max_products})"
            }
        
        return {
            "allowed": True,
            "current": current_count,
            "limit": max_products,
            "remaining": max_products - current_count
        }
    
    @staticmethod
    async def validate_product_data(data: Dict, tenant_id: str) -> Dict:
        """Validate product data before creation"""
        # TODO: Add validation logic
        return {"valid": True, "errors": []}

