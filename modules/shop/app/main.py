"""
Shop Module - Main FastAPI Application
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1 import public, account, dashboard, webhooks, internal

app = FastAPI(
    title="Shop Module API",
    version="1.0.0",
    description="Интернет-магазин модуль",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(public.router, prefix="/api/v1/public", tags=["public"])
app.include_router(account.router, prefix="/api/v1/account", tags=["account"])
app.include_router(dashboard.router, prefix="/api/v1/dashboard", tags=["dashboard"])
app.include_router(webhooks.router, prefix="/api/v1/webhooks", tags=["webhooks"])
app.include_router(internal.router, prefix="/api/v1/internal", tags=["internal"])


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "ok", "module": "shop", "version": "1.0.0"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)



