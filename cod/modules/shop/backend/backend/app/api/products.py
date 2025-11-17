"""
Products API Routes
Uses module's own database (per tenant) via SDK
"""
from fastapi import APIRouter, Depends, HTTPException, Request
from typing import Optional
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
import sys
from pathlib import Path

try:
    from app.modules.sdk import get_subscription_status, get_tenant_info
except ImportError:
    # Fallback for module development
    import sys
    from pathlib import Path
    core_backend_path = Path(__file__).parent.parent.parent.parent / "core-backend"
    if core_backend_path.exists():
        sys.path.insert(0, str(core_backend_path))
        from app.modules.sdk import get_subscription_status, get_tenant_info

from ..db.session import get_module_db
from ..models.product import Product
from ..services.product_service import ProductService

router = APIRouter(prefix="/api/products", tags=["products"])


def get_tenant_id(request: Request) -> str:
    """Extract tenant_id from request headers"""
    tenant_id = request.headers.get("X-Tenant-ID")
    if not tenant_id:
        raise HTTPException(status_code=401, detail="Tenant ID not found")
    return tenant_id


@router.get("")
async def list_products(
    request: Request,
    tenant_id: str = Depends(get_tenant_id),
    skip: int = 0,
    limit: int = 20
):
    """
    List products with subscription limit check
    Uses module's own database (per tenant via SDK)
    """
    # Check subscription via SDK
    subscription = await get_subscription_status(tenant_id)
    
    if not subscription.get("active"):
        raise HTTPException(status_code=403, detail="Subscription not active")
    
    max_products = subscription.get("limits", {}).get("products", 50)
    
    # Fetch products from module DB (separate DB per tenant)
    async with get_module_db(tenant_id, module_id="shop") as session:
        # Get total count
        total_query = select(func.count()).select_from(Product).where(
            Product.tenant_id == tenant_id,
            Product.active == True
        )
        total = await session.scalar(total_query)
        
        # Get products with pagination
        products_query = select(Product).where(
            Product.tenant_id == tenant_id,
            Product.active == True
        ).offset(skip).limit(limit)
        
        result = await session.execute(products_query)
        products = result.scalars().all()
        
        return {
            "products": [p.to_dict() for p in products],
            "total": total or 0,
            "limit": max_products,
            "has_more": (total or 0) > skip + limit
        }


@router.get("/{product_id}")
async def get_product(
    product_id: str,
    request: Request,
    tenant_id: str = Depends(get_tenant_id)
):
    """Get single product from module DB"""
    async with get_module_db(tenant_id, module_id="shop") as session:
        query = select(Product).where(
            Product.id == product_id,
            Product.tenant_id == tenant_id
        )
        result = await session.execute(query)
        product = result.scalar_one_or_none()
        
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        
        return product.to_dict()


@router.post("")
async def create_product(
    request: Request,
    tenant_id: str = Depends(get_tenant_id)
):
    """Create new product in module DB"""
    # Check subscription limits via SDK
    subscription = await get_subscription_status(tenant_id)
    
    if not subscription.get("active"):
        raise HTTPException(status_code=403, detail="Subscription not active")
    
    max_products = subscription.get("limits", {}).get("products", 50)
    
    # Parse request body
    body = await request.json()
    
    # Check product limit
    async with get_module_db(tenant_id, module_id="shop") as session:
        # Count current products
        count_query = select(func.count()).select_from(Product).where(
            Product.tenant_id == tenant_id,
            Product.active == True
        )
        current_count = await session.scalar(count_query) or 0
        
        # Check limit
        if max_products != -1 and current_count >= max_products:
            raise HTTPException(
                status_code=403,
                detail=f"Product limit reached ({max_products})"
            )
        
        # Create product
        import uuid
        product = Product(
            id=str(uuid.uuid4()),
            tenant_id=tenant_id,
            name=body.get("name"),
            description=body.get("description"),
            price=float(body.get("price", 0)),
            stock=int(body.get("stock", 0)),
            sku=body.get("sku"),
            image_url=body.get("image_url"),
            active=True
        )
        
        session.add(product)
        await session.commit()
        await session.refresh(product)
        
        return {"success": True, "product": product.to_dict()}

