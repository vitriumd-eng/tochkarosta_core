"""
Утилиты для валидации данных
"""
import re
from typing import Optional

def validate_phone(phone: str) -> bool:
    """
    Валидация номера телефона
    Принимает форматы: +79991234567, 79991234567, 89991234567
    """
    if not phone:
        return False
    
    # Удаляем все пробелы и дефисы
    phone = re.sub(r'[\s\-]', '', phone)
    
    # Проверяем формат
    pattern = r'^(\+7|7|8)?9\d{9}$'
    return bool(re.match(pattern, phone))

def normalize_phone(phone: str) -> Optional[str]:
    """
    Нормализация номера телефона к формату +79991234567
    """
    if not phone:
        return None
    
    # Удаляем все пробелы и дефисы
    phone = re.sub(r'[\s\-]', '', phone)
    
    # Убираем +7, 7, 8 в начале
    if phone.startswith('+7'):
        phone = phone[2:]
    elif phone.startswith('7'):
        phone = phone[1:]
    elif phone.startswith('8'):
        phone = phone[1:]
    
    # Проверяем, что осталось 10 цифр
    if len(phone) == 10 and phone.isdigit():
        return f'+7{phone}'
    
    return None

def validate_email(email: str) -> bool:
    """
    Простая валидация email
    """
    if not email:
        return False
    
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))

def validate_domain(domain: str) -> bool:
    """
    Валидация доменного имени
    """
    if not domain:
        return False
    
    # Простая проверка формата домена
    pattern = r'^[a-z0-9]([a-z0-9\-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9\-]{0,61}[a-z0-9])?)*$'
    return bool(re.match(pattern, domain.lower()))



