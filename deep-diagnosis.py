"""
Глубокая диагностика системы для выявления проблемы с логином
"""
import asyncio
import sys
import os
import traceback

sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'core-backend'))

from app.db.session import get_db, init_db_pool, close_db_pool
from app.security.jwt import create_access_token
from app.api.platform import platform_login, LoginRequest
import bcrypt

async def diagnose():
    """Полная диагностика системы"""
    print("=== ГЛУБОКАЯ ДИАГНОСТИКА СИСТЕМЫ ===")
    print()
    
    # 1. Проверка подключения к БД
    print("1. ПРОВЕРКА ПОДКЛЮЧЕНИЯ К БД:")
    try:
        await init_db_pool()
        print("   [OK] Пул подключений инициализирован")
    except Exception as e:
        print(f"   [ERROR] Ошибка инициализации пула: {e}")
        traceback.print_exc()
        return
    
    # 2. Проверка получения пользователя
    print()
    print("2. ПРОВЕРКА ПОЛУЧЕНИЯ ПОЛЬЗОВАТЕЛЯ:")
    try:
        async with get_db() as db:
            user = await db.fetchrow(
                "SELECT id, phone, password_hash, role FROM users WHERE phone = $1",
                "89535574133"
            )
            if user:
                print(f"   [OK] Пользователь найден: {user['id']}")
                print(f"   [OK] Роль: {user['role']}")
                print(f"   [OK] Хеш существует: {user['password_hash'] is not None}")
                print(f"   [OK] Длина хеша: {len(user['password_hash']) if user['password_hash'] else 0}")
            else:
                print("   [ERROR] Пользователь не найден")
                await close_db_pool()
                return
    except Exception as e:
        print(f"   [ERROR] Ошибка получения пользователя: {e}")
        traceback.print_exc()
        await close_db_pool()
        return
    
    # 3. Проверка проверки пароля
    print()
    print("3. ПРОВЕРКА ПРОВЕРКИ ПАРОЛЯ:")
    try:
        password = "Tehnologick987"
        password_hash_bytes = user['password_hash'].encode('utf-8') if isinstance(user['password_hash'], str) else user['password_hash']
        password_valid = bcrypt.checkpw(password.encode('utf-8'), password_hash_bytes)
        print(f"   [OK] Проверка пароля: {password_valid}")
        if not password_valid:
            print("   [ERROR] Пароль не совпадает")
            await close_db_pool()
            return
    except Exception as e:
        print(f"   [ERROR] Ошибка проверки пароля: {e}")
        traceback.print_exc()
        await close_db_pool()
        return
    
    # 4. Проверка создания токена
    print()
    print("4. ПРОВЕРКА СОЗДАНИЯ ТОКЕНА:")
    try:
        token = create_access_token({
            "sub": str(user['id']),
            "role": user['role']
        })
        print(f"   [OK] Токен создан: {token[:50]}...")
        print(f"   [OK] Длина токена: {len(token)}")
    except Exception as e:
        print(f"   [ERROR] Ошибка создания токена: {e}")
        traceback.print_exc()
        await close_db_pool()
        return
    
    # 5. Симуляция вызова endpoint напрямую
    print()
    print("5. СИМУЛЯЦИЯ ВЫЗОВА ENDPOINT:")
    try:
        login_request = LoginRequest(login="89535574133", password="Tehnologick987")
        result = await platform_login(login_request)
        print(f"   [OK] Endpoint отработал успешно")
        print(f"   [OK] Токен: {result.token[:50]}...")
        print(f"   [OK] Роль: {result.role}")
    except Exception as e:
        print(f"   [ERROR] Ошибка в endpoint: {e}")
        print(f"   [ERROR] Тип ошибки: {type(e).__name__}")
        traceback.print_exc()
    
    await close_db_pool()

if __name__ == "__main__":
    asyncio.run(diagnose())

