"""
Утилиты для пагинации
"""
from typing import Generic, TypeVar, Optional
from pydantic import BaseModel
from math import ceil

T = TypeVar('T')

class PaginationParams(BaseModel):
    """Параметры пагинации"""
    page: int = 1
    page_size: int = 20
    
    @property
    def offset(self) -> int:
        """Смещение для запроса"""
        return (self.page - 1) * self.page_size
    
    @property
    def limit(self) -> int:
        """Лимит записей"""
        return self.page_size

class PaginatedResponse(BaseModel, Generic[T]):
    """Пагинированный ответ"""
    items: list[T]
    total: int
    page: int
    page_size: int
    total_pages: int
    has_next: bool
    has_prev: bool
    
    @classmethod
    def create(
        cls,
        items: list[T],
        total: int,
        page: int,
        page_size: int
    ) -> "PaginatedResponse[T]":
        """Создать пагинированный ответ"""
        total_pages = ceil(total / page_size) if page_size > 0 else 0
        
        return cls(
            items=items,
            total=total,
            page=page,
            page_size=page_size,
            total_pages=total_pages,
            has_next=page < total_pages,
            has_prev=page > 1
        )







