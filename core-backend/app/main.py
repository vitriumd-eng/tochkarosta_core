"""
Core Backend - FastAPI Main Application
Modular SaaS Platform Core
"""
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
import uvicorn
import os
import logging
from contextlib import asynccontextmanager
from app.middleware.tenant import TenantMiddleware
from app.middleware.correlation import CorrelationIdMiddleware

# Настройка логирования
logging.basicConfig(
    level=logging.INFO,
    format='[%(asctime)s] %(levelname)s [%(name)s] %(message)s'
)
logger = logging.getLogger(__name__)

# Lifespan: Autoload modules from /modules/*/manifest.json
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan event handler for startup and shutdown"""
    # Startup
    try:
        from app.utils.module_loader import sync_modules_to_registry
        count = await sync_modules_to_registry()
        logger.info(f"Loaded {count} modules from disk to registry")
    except Exception as e:
        logger.error(f"Failed to load modules at startup: {e}", exc_info=True)
    
    yield
    
    # Shutdown
    logger.info("Shutting down application")


app = FastAPI(
    title="Modular SaaS Core",
    description="Core backend for modular SaaS platform",
    version="1.0.0",
    lifespan=lifespan
)

# Обработчик ошибок валидации
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    logger.warning(f"Validation error: {exc.errors()}")
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors(), "body": str(exc.body) if hasattr(exc, 'body') else None}
    )

# Обработчик общих исключений (не перехватывает HTTPException)
@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    from fastapi import HTTPException
    # Пропускаем HTTPException - они обрабатываются FastAPI
    if isinstance(exc, HTTPException):
        raise exc
    logger.error(
        f"Unhandled exception: {type(exc).__name__}: {exc}",
        exc_info=True,
        extra={
            "path": request.url.path,
            "method": request.method,
            "request_id": request.headers.get("X-Request-ID")
        }
    )
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )

# Database engine is initialized automatically in session.py

# Middleware
app.add_middleware(CorrelationIdMiddleware)
app.add_middleware(TenantMiddleware)

# CORS
from app.core.config import settings
cors_origins = settings.cors_origins_list
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers from v1
from app.api.v1.routes import auth, tenants, subscriptions, modules, platform, users, super_admin, dev

app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(users.router, prefix="/api/v1/users", tags=["users"])
app.include_router(tenants.router, prefix="/api/v1/tenants", tags=["tenants"])
app.include_router(subscriptions.router, prefix="/api/v1/subscriptions", tags=["subscriptions"])
app.include_router(modules.router, prefix="/api/v1/modules", tags=["modules"])
app.include_router(platform.router, prefix="/api/v1/platform", tags=["platform"])
app.include_router(super_admin.router, prefix="/api/v1/super-admin", tags=["super-admin"])
app.include_router(dev.router, prefix="/api/v1/dev", tags=["dev"])


@app.get("/")
async def root():
    return {"message": "Modular SaaS Core API", "version": "1.0.0"}


@app.get("/health")
async def health():
    return {"status": "healthy"}


if __name__ == "__main__":
    from app.core.config import settings
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=True)

