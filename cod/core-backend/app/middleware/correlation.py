"""
Correlation ID Middleware - Add X-Request-ID header
"""
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response
from typing import Callable
import uuid


class CorrelationIdMiddleware(BaseHTTPMiddleware):
    """Add X-Request-ID correlation id to requests"""
    
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        correlation_id = request.headers.get("X-Request-ID") or str(uuid.uuid4())
        request.state.correlation_id = correlation_id
        
        response = await call_next(request)
        response.headers["X-Request-ID"] = correlation_id
        return response



