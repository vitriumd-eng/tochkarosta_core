"""
Скрипт для создания пользователя с правами platform_master (модератор платформенной страницы)
"""
import asyncio
import sys
import os

# Добавляем корневую директорию в путь
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import AsyncSessionLocal
from app.models.user import User
from app.models.tenant import Tenant  # Импортируем для инициализации relationships
from app.modules.billing.models import Subscription  # Импортируем для инициализации relationships
from app.utils.hashing import get_password_hash
from app.utils.validators import normalize_phone


async def create_platform_master():
    """Создает пользователя с правами platform_master"""
    
    phone = "89535574133"
    password = "Tehnologick987"
    first_name = "Platform"
    last_name = "Master"
    
    # Нормализуем номер телефона
    normalized_phone = normalize_phone(phone)
    if not normalized_phone:
        print(f"[ERROR] Неверный формат номера телефона: {phone}")
        return
    
    print(f"[INFO] Нормализованный номер: {normalized_phone}")
    
    async with AsyncSessionLocal() as db:
        try:
            # Проверяем, существует ли пользователь
            result = await db.execute(
                select(User).where(User.phone == normalized_phone)
            )
            existing_user = result.scalar_one_or_none()
            
            if existing_user:
                print(f"[WARNING] Пользователь с номером {normalized_phone} уже существует")
                
                # Обновляем данные пользователя
                existing_user.password_hash = get_password_hash(password)
                existing_user.role = "master"
                existing_user.first_name = first_name
                existing_user.last_name = last_name
                existing_user.phone_verified = True
                existing_user.is_superuser = False
                
                await db.commit()
                await db.refresh(existing_user)
                
                print(f"[SUCCESS] Пользователь обновлен:")
                print(f"   ID: {existing_user.id}")
                print(f"   Телефон: {existing_user.phone}")
                print(f"   Роль: {existing_user.role}")
                print(f"   Имя: {existing_user.first_name} {existing_user.last_name}")
                return
            
            # Создаем нового пользователя
            new_user = User(
                phone=normalized_phone,
                password_hash=get_password_hash(password),
                first_name=first_name,
                last_name=last_name,
                role="master",
                is_superuser=False,
                phone_verified=True,
                tenant_id=None  # Модератор не привязан к tenant
            )
            
            db.add(new_user)
            await db.commit()
            await db.refresh(new_user)
            
            print(f"[SUCCESS] Пользователь создан успешно:")
            print(f"   ID: {new_user.id}")
            print(f"   Телефон: {new_user.phone}")
            print(f"   Роль: {new_user.role}")
            print(f"   Имя: {new_user.first_name} {new_user.last_name}")
            print(f"   Логин: {normalized_phone}")
            print(f"   Пароль: {password}")
            
        except Exception as e:
            await db.rollback()
            print(f"[ERROR] Ошибка при создании пользователя: {e}")
            raise


if __name__ == "__main__":
    print("Создание пользователя с правами platform_master...")
    print("=" * 50)
    asyncio.run(create_platform_master())
    print("=" * 50)
    print("Готово!")

