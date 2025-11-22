"""
Вспомогательные функции
"""
import uuid
from typing import Optional
from datetime import datetime, timedelta

def generate_tenant_domain(prefix: str = "u") -> str:
    """
    Генерация уникального домена для tenant
    Формат: u-{8 символов hex}
    """
    unique_id = uuid.uuid4().hex[:8]
    return f"{prefix}-{unique_id}"

def format_phone_display(phone: str) -> str:
    """
    Форматирование телефона для отображения
    +79991234567 -> +7 (999) 123-45-67
    """
    if not phone or len(phone) < 12:
        return phone
    
    if phone.startswith('+7'):
        cleaned = phone[2:]
        if len(cleaned) == 10:
            return f"+7 ({cleaned[0:3]}) {cleaned[3:6]}-{cleaned[6:8]}-{cleaned[8:10]}"
    
    return phone

def calculate_subscription_end_date(start_date: datetime, months: int) -> datetime:
    """
    Вычисление даты окончания подписки
    """
    # Простое добавление месяцев (не учитывает разные длины месяцев)
    return start_date + timedelta(days=months * 30)

def mask_phone(phone: str) -> str:
    """
    Маскировка телефона для безопасности
    +79991234567 -> +7***123**67
    """
    if not phone or len(phone) < 7:
        return phone
    
    if phone.startswith('+7') and len(phone) == 12:
        return f"+7***{phone[5:8]}**{phone[10:12]}"
    
    return phone

def is_uuid(value: str) -> bool:
    """
    Проверка, является ли строка валидным UUID
    """
    try:
        uuid.UUID(value)
        return True
    except (ValueError, AttributeError):
        return False







