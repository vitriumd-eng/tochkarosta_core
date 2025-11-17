"""Direct test of login endpoint"""
import asyncio
import asyncpg
import bcrypt
import os
from dotenv import load_dotenv
from pathlib import Path
from app.security.jwt import create_access_token

load_dotenv(Path('.env'))

async def test_login_flow():
    """Test login flow step by step"""
    print("[INFO] Тестирование логина пошагово...")
    
    # Step 1: Connect to DB
    db_url = os.getenv('DATABASE_URL')
    print(f"[1] Подключение к БД...")
    try:
        conn = await asyncpg.connect(db_url)
        print("[OK] Подключение установлено")
    except Exception as e:
        print(f"[ERROR] Ошибка подключения: {e}")
        return
    
    # Step 2: Find user
    login = "89535574133"
    password = "Tehnologick987"
    print(f"[2] Поиск пользователя: {login}")
    try:
        user = await conn.fetchrow(
            "SELECT id, phone, password_hash, role FROM users WHERE phone = $1",
            login
        )
        if not user:
            print("[ERROR] Пользователь не найден")
            await conn.close()
            return
        print(f"[OK] Пользователь найден: {user['id']}, role: {user['role']}")
    except Exception as e:
        print(f"[ERROR] Ошибка запроса: {e}")
        await conn.close()
        return
    
    # Step 3: Check password
    print("[3] Проверка пароля...")
    try:
        password_hash = user['password_hash']
        if isinstance(password_hash, str):
            password_hash = password_hash.encode('utf-8')
        
        password_valid = bcrypt.checkpw(
            password.encode('utf-8'),
            password_hash
        )
        print(f"[OK] Пароль валиден: {password_valid}")
    except Exception as e:
        print(f"[ERROR] Ошибка проверки пароля: {type(e).__name__}: {e}")
        await conn.close()
        return
    
    # Step 4: Create JWT
    print("[4] Создание JWT токена...")
    try:
        token = create_access_token({
            "sub": str(user["id"]),
            "role": user["role"]
        })
        print(f"[OK] Токен создан: {token[:30]}...")
    except Exception as e:
        print(f"[ERROR] Ошибка создания токена: {type(e).__name__}: {e}")
        await conn.close()
        return
    
    await conn.close()
    print("[SUCCESS] Все шаги выполнены успешно!")

if __name__ == '__main__':
    asyncio.run(test_login_flow())

