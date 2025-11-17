"""
Request Context Middleware - Store request context for access across application
"""
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response
from typing import Callable, Optional
import logging

logger = logging.getLogger(__name__)


class RequestContextMiddleware(BaseHTTPMiddleware):
    """
    Request Context Middleware
    Stores request context (tenant_id, user_id, correlation_id) for access across application
    """
    
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        """
        Store request context in request.state
        Context includes: tenant_id, user_id, correlation_id, active_module
        """
        # Initialize request context if not already set
        if not hasattr(request.state, 'tenant_id'):
            request.state.tenant_id = None
        if not hasattr(request.state, 'user_id'):
            request.state.user_id = None
        if not hasattr(request.state, 'correlation_id'):
            # Get correlation ID from header or generate new
            request.state.correlation_id = request.headers.get("X-Request-ID", None)
        if not hasattr(request.state, 'active_module'):
            request.state.active_module = None
        
        # Process request
        response = await call_next(request)
        
        # Add correlation ID to response if set
        if hasattr(request.state, 'correlation_id') and request.state.correlation_id:
            response.headers["X-Request-ID"] = request.state.correlation_id
        
        return response


def get_request_context(request: Request) -> dict:
    """
    Helper function to get request context from request.state
    
    Args:
        request: FastAPI Request object
        
    Returns:
        Dict with request context: tenant_id, user_id, correlation_id, active_module
    """
    return {
        "tenant_id": getattr(request.state, 'tenant_id', None),
        "user_id": getattr(request.state, 'user_id', None),
        "correlation_id": getattr(request.state, 'correlation_id', None),
        "active_module": getattr(request.state, 'active_module', None),
    }





