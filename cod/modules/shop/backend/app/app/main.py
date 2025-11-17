"""
Shop Module Backend - FastAPI Application
Autonomous module for e-commerce functionality
Uses SDK for core interaction - NO direct core imports
"""
from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import sys
from pathlib import Path

# Add paths for SDK imports
# Path: app/main.py -> app -> backend -> shop -> modules -> root -> core-backend
sys.path.insert(0, str(Path(__file__).parent.parent.parent.parent))

# Import SDK functions (only way to interact with core)
# Note: In production, SDK should be accessible via installed package or shared path
# For now, using relative path - adjust based on your deployment setup
try:
    from app.modules.sdk import (
        get_subscription_status,
        get_tenant_info,
        get_tenant_database_url
    )
except ImportError:
    # Fallback for module development
    import sys
    from pathlib import Path
    core_backend_path = Path(__file__).parent.parent.parent.parent / "core-backend"
    if core_backend_path.exists():
        sys.path.insert(0, str(core_backend_path))
        from app.modules.sdk import (
            get_subscription_status,
            get_tenant_info,
            get_tenant_database_url
        )

# Import module routers and components
from .api.products import router as products_router
from .db.base import Base
from .db.session import get_module_db, close_module_db_engines

app = FastAPI(
    title="Shop Module API",
    description="E-commerce module for managing products, orders, and cart",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure based on your needs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_tenant_id(request: Request) -> str:
    """Extract tenant_id from request headers (set by core middleware)"""
    tenant_id = request.headers.get("X-Tenant-ID")
    if not tenant_id:
        raise HTTPException(status_code=401, detail="Tenant ID not found")
    return tenant_id


def get_user_id(request: Request) -> Optional[str]:
    """Extract user_id from request headers"""
    return request.headers.get("X-User-ID")


# Include routers
app.include_router(products_router)


@app.on_event("startup")
async def startup():
    """Initialize module on startup"""
    # Note: Tables are created via migrations, not here
    # This ensures proper version control and tenant-specific databases
    pass


@app.on_event("shutdown")
async def shutdown():
    """Cleanup on shutdown"""
    await close_module_db_engines()


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "ok", "module": "shop"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)

