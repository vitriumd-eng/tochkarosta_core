import logging
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.core.logging_config import setup_logging
from app.core.health import router as health_router
from app.modules.auth.routes import router as auth_router
from app.modules.tenants.routes import router as tenants_router
from app.modules.billing.routes import router as billing_router
from app.modules.chat import router as chat_router

# Настройка логирования
logger = setup_logging()

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info(f"🚀 CORE Starting up in {settings.ENVIRONMENT} mode...")
    # Здесь можно добавить проверку БД
    yield
    logger.info("🛑 CORE Shutting down...")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    lifespan=lifespan
)

# CORS Setup
origins = settings.BACKEND_CORS_ORIGINS
if isinstance(origins, str):
    origins = origins.split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global error: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal Server Error (Check logs)"}
    )

# Register Routes
app.include_router(health_router, tags=["Health"])
app.include_router(auth_router, prefix="/api/auth", tags=["Auth"])
app.include_router(tenants_router, prefix="/api/tenants", tags=["Tenants"])
app.include_router(billing_router, prefix="/api/billing", tags=["Billing"])
app.include_router(chat_router, tags=["Chat"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)