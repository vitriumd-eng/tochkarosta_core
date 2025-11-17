"""Test database connection"""
import asyncio
import asyncpg
import os
from dotenv import load_dotenv
from pathlib import Path

load_dotenv(Path('.env'))

async def test_connection():
    db_url = os.getenv('DATABASE_URL')
    if not db_url:
        print('[ERROR] DATABASE_URL не установлен в .env')
        return
    
    print(f'[INFO] Подключение к БД...')
    print(f'[INFO] URL: {db_url.split("@")[0] if "@" in db_url else "unknown"}@***')
    
    try:
        conn = await asyncpg.connect(db_url, timeout=5)
        print('[OK] Подключение успешно')
        
        # Проверим пользователя
        user = await conn.fetchrow(
            "SELECT id, phone, role, password_hash IS NOT NULL as has_password FROM users WHERE phone = $1",
            '89535574133'
        )
        
        if user:
            print(f'[OK] Пользователь найден:')
            print(f'  ID: {user["id"]}')
            print(f'  Phone: {user["phone"]}')
            print(f'  Role: {user["role"]}')
            print(f'  Has password: {user["has_password"]}')
        else:
            print('[WARNING] Пользователь не найден')
        
        await conn.close()
    except asyncpg.InvalidPasswordError:
        print('[ERROR] Неправильный пароль')
    except asyncpg.InvalidCatalogNameError:
        print('[ERROR] База данных не найдена')
    except asyncpg.ConnectionDoesNotExistError:
        print('[ERROR] Сервер PostgreSQL недоступен')
    except Exception as e:
        print(f'[ERROR] Ошибка подключения: {type(e).__name__}: {e}')

if __name__ == '__main__':
    asyncio.run(test_connection())

