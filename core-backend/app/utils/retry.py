"""
Retry utility for HTTP requests and other operations
Supports exponential backoff and configurable retries
"""
import asyncio
import logging
from typing import Callable, TypeVar, Optional, List
from functools import wraps
import httpx

logger = logging.getLogger(__name__)

T = TypeVar('T')


def retry_async(
    max_attempts: int = 3,
    base_delay: float = 1.0,
    max_delay: float = 10.0,
    exponential_base: float = 2.0,
    retryable_exceptions: Optional[tuple] = None,
    enabled: bool = True
):
    """
    Decorator for retrying async functions with exponential backoff
    
    Args:
        max_attempts: Maximum number of retry attempts
        base_delay: Base delay in seconds for exponential backoff
        max_delay: Maximum delay in seconds
        exponential_base: Base for exponential backoff calculation
        retryable_exceptions: Tuple of exceptions to retry on (default: httpx.RequestError, httpx.HTTPStatusError)
        enabled: Whether retry is enabled (can be disabled for dev mode)
    """
    if retryable_exceptions is None:
        retryable_exceptions = (httpx.RequestError, httpx.HTTPStatusError)
    
    def decorator(func: Callable[..., T]) -> Callable[..., T]:
        @wraps(func)
        async def wrapper(*args, **kwargs) -> T:
            if not enabled:
                # If retry is disabled (dev mode), just execute once
                return await func(*args, **kwargs)
            
            last_exception = None
            for attempt in range(1, max_attempts + 1):
                try:
                    return await func(*args, **kwargs)
                except retryable_exceptions as e:
                    last_exception = e
                    if attempt == max_attempts:
                        # Last attempt failed
                        logger.error(
                            f"{func.__name__} failed after {max_attempts} attempts: {e}",
                            extra={"attempt": attempt, "max_attempts": max_attempts}
                        )
                        raise
                    
                    # Calculate delay with exponential backoff
                    delay = min(base_delay * (exponential_base ** (attempt - 1)), max_delay)
                    
                    logger.warning(
                        f"{func.__name__} failed (attempt {attempt}/{max_attempts}): {e}. Retrying in {delay}s...",
                        extra={"attempt": attempt, "max_attempts": max_attempts, "delay": delay}
                    )
                    
                    await asyncio.sleep(delay)
                except Exception as e:
                    # Non-retryable exception, raise immediately
                    logger.error(
                        f"{func.__name__} failed with non-retryable exception: {e}",
                        exc_info=True
                    )
                    raise
            
            # Should never reach here, but just in case
            if last_exception:
                raise last_exception
            raise RuntimeError(f"{func.__name__} failed unexpectedly")
        
        return wrapper
    return decorator


async def http_request_with_retry(
    client: httpx.AsyncClient,
    method: str,
    url: str,
    max_attempts: int = 3,
    base_delay: float = 1.0,
    max_delay: float = 10.0,
    enabled: bool = True,
    **kwargs
) -> httpx.Response:
    """
    Make HTTP request with retry logic
    
    Args:
        client: httpx AsyncClient
        method: HTTP method (GET, POST, etc.)
        url: Request URL
        max_attempts: Maximum retry attempts
        base_delay: Base delay for exponential backoff
        max_delay: Maximum delay
        enabled: Whether retry is enabled
        **kwargs: Additional arguments to pass to client.request()
    
    Returns:
        httpx.Response object
    """
    if not enabled:
        # If retry is disabled (dev mode), just make request once
        return await client.request(method, url, **kwargs)
    
    last_exception = None
    for attempt in range(1, max_attempts + 1):
        try:
            response = await client.request(method, url, **kwargs)
            # Retry on 5xx errors
            if response.status_code >= 500:
                if attempt == max_attempts:
                    response.raise_for_status()
                
                delay = min(base_delay * (2 ** (attempt - 1)), max_delay)
                logger.warning(
                    f"HTTP {method} {url} returned {response.status_code} (attempt {attempt}/{max_attempts}). Retrying in {delay}s...",
                    extra={"attempt": attempt, "max_attempts": max_attempts, "status_code": response.status_code}
                )
                await asyncio.sleep(delay)
                continue
            
            return response
        except (httpx.RequestError, httpx.HTTPStatusError) as e:
            last_exception = e
            if attempt == max_attempts:
                logger.error(
                    f"HTTP {method} {url} failed after {max_attempts} attempts: {e}",
                    extra={"attempt": attempt, "max_attempts": max_attempts}
                )
                raise
            
            delay = min(base_delay * (2 ** (attempt - 1)), max_delay)
            logger.warning(
                f"HTTP {method} {url} failed (attempt {attempt}/{max_attempts}): {e}. Retrying in {delay}s...",
                extra={"attempt": attempt, "max_attempts": max_attempts, "delay": delay}
            )
            await asyncio.sleep(delay)
    
    if last_exception:
        raise last_exception
    raise RuntimeError(f"HTTP {method} {url} failed unexpectedly")


