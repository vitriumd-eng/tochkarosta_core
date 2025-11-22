"""
Rate limiting утилиты
Для защиты от злоупотреблений API
"""
from functools import wraps
from typing import Callable
from fastapi import HTTPException, Request
from datetime import datetime, timedelta
import asyncio

# Простое in-memory хранилище для rate limiting
# В продакшене используйте Redis
_rate_limit_store: dict[str, list[datetime]] = {}
_rate_limit_lock = asyncio.Lock()

async def check_rate_limit(
    key: str,
    max_requests: int = 10,
    window_seconds: int = 60
) -> bool:
    """
    Проверка rate limit
    
    Args:
        key: Уникальный ключ (например, IP адрес или user_id)
        max_requests: Максимальное количество запросов
        window_seconds: Окно времени в секундах
    
    Returns:
        True если запрос разрешен, False если превышен лимит
    """
    async with _rate_limit_lock:
        now = datetime.utcnow()
        window_start = now - timedelta(seconds=window_seconds)
        
        # Получаем список запросов для ключа
        requests = _rate_limit_store.get(key, [])
        
        # Удаляем старые запросы вне окна
        requests = [req_time for req_time in requests if req_time > window_start]
        
        # Проверяем лимит
        if len(requests) >= max_requests:
            return False
        
        # Добавляем текущий запрос
        requests.append(now)
        _rate_limit_store[key] = requests
        
        return True

def rate_limit(
    max_requests: int = 10,
    window_seconds: int = 60,
    key_func: Callable[[Request], str] = None
):
    """
    Декоратор для rate limiting endpoint'ов
    
    Usage:
        @app.get("/api/endpoint")
        @rate_limit(max_requests=5, window_seconds=60)
        async def endpoint(request: Request):
            ...
    """
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # Извлекаем Request из аргументов
            request = None
            for arg in args:
                if isinstance(arg, Request):
                    request = arg
                    break
            
            if not request:
                raise ValueError("Request object not found")
            
            # Генерируем ключ
            if key_func:
                key = key_func(request)
            else:
                # По умолчанию используем IP адрес
                key = request.client.host if request.client else "unknown"
            
            # Проверяем rate limit
            allowed = await check_rate_limit(key, max_requests, window_seconds)
            if not allowed:
                raise HTTPException(
                    status_code=429,
                    detail=f"Rate limit exceeded. Max {max_requests} requests per {window_seconds} seconds"
                )
            
            return await func(*args, **kwargs)
        return wrapper
    return decorator







