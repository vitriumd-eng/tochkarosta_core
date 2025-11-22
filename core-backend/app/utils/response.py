"""
Утилиты для формирования ответов API
"""
from typing import Any, Optional
from fastapi.responses import JSONResponse
from fastapi import status

def success_response(
    data: Any = None,
    message: str = "Success",
    status_code: int = status.HTTP_200_OK
) -> JSONResponse:
    """Формирование успешного ответа"""
    response_data = {
        "success": True,
        "message": message
    }
    if data is not None:
        response_data["data"] = data
    
    return JSONResponse(
        content=response_data,
        status_code=status_code
    )

def error_response(
    message: str = "Error",
    status_code: int = status.HTTP_400_BAD_REQUEST,
    errors: Optional[dict] = None
) -> JSONResponse:
    """Формирование ответа с ошибкой"""
    response_data = {
        "success": False,
        "message": message
    }
    if errors:
        response_data["errors"] = errors
    
    return JSONResponse(
        content=response_data,
        status_code=status_code
    )

def paginated_response(
    items: list,
    total: int,
    page: int = 1,
    page_size: int = 20,
    message: str = "Success"
) -> JSONResponse:
    """Формирование пагинированного ответа"""
    total_pages = (total + page_size - 1) // page_size
    
    return JSONResponse(
        content={
            "success": True,
            "message": message,
            "data": {
                "items": items,
                "pagination": {
                    "page": page,
                    "page_size": page_size,
                    "total": total,
                    "total_pages": total_pages,
                    "has_next": page < total_pages,
                    "has_prev": page > 1
                }
            }
        }
    )







