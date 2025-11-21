"""
Health check утилиты
"""
from fastapi import APIRouter
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from app.core.database import engine
from app.core.config import settings
import redis.asyncio as redis
from typing import Dict, Any

router = APIRouter()

@router.get("/health")
async def health_check() -> Dict[str, Any]:
    """Базовый health check"""
    return {
        "status": "ok",
        "environment": settings.ENVIRONMENT,
        "version": settings.VERSION
    }

@router.get("/health/detailed")
async def detailed_health_check() -> Dict[str, Any]:
    """Детальный health check с проверкой зависимостей"""
    health_status = {
        "status": "ok",
        "environment": settings.ENVIRONMENT,
        "version": settings.VERSION,
        "checks": {}
    }
    
    # Проверка БД
    try:
        async with engine.connect() as conn:
            await conn.execute(text("SELECT 1"))
        health_status["checks"]["database"] = "ok"
    except Exception as e:
        health_status["checks"]["database"] = f"error: {str(e)}"
        health_status["status"] = "degraded"
    
    # Проверка Redis
    try:
        if settings.REDIS_URL:
            redis_client = redis.from_url(settings.REDIS_URL)
            await redis_client.ping()
            await redis_client.close()
            health_status["checks"]["redis"] = "ok"
        else:
            health_status["checks"]["redis"] = "not configured"
    except Exception as e:
        health_status["checks"]["redis"] = f"error: {str(e)}"
        health_status["status"] = "degraded"
    
    return health_status



