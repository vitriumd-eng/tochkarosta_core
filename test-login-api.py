"""
Тест API логина
"""
import asyncio
import sys
import os
import bcrypt
import httpx

sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'core-backend'))

from app.db.session import get_db, init_db_pool, close_db_pool
from app.security.jwt import create_access_token

async def test_login_flow():
    """Тест полного процесса логина"""
    await init_db_pool()
    
    login = "89535574133"
    password = "Tehnologick987"
    
    print("=== Тест процесса логина ===")
    print()
    
    # Шаг 1: Проверка пользователя в БД
    async with get_db() as db:
        user = await db.fetchrow(
            "SELECT id, phone, password_hash, role FROM users WHERE phone = $1",
            login
        )
        
        if not user:
            print("[ERROR] User not found")
            await close_db_pool()
            return
        
        print(f"[OK] User found: {user['id']}")
        print(f"   Role: {user['role']}")
        print(f"   Hash length: {len(user['password_hash']) if user['password_hash'] else 0}")
    
    # Шаг 2: Проверка пароля
    password_hash_bytes = user['password_hash'].encode('utf-8') if isinstance(user['password_hash'], str) else user['password_hash']
    password_valid = bcrypt.checkpw(password.encode('utf-8'), password_hash_bytes)
    
    if not password_valid:
        print("[ERROR] Password verification failed")
        await close_db_pool()
        return
    
    print("[OK] Password verification successful")
    
    # Шаг 3: Создание токена
    try:
        token = create_access_token({
            "sub": str(user['id']),
            "role": user['role']
        })
        print(f"[OK] Token created: {token[:50]}...")
    except Exception as e:
        print(f"[ERROR] Token creation failed: {e}")
        await close_db_pool()
        return
    
    # Шаг 4: Тест API запроса
    print()
    print("=== Тест API запроса ===")
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "http://localhost:8000/api/platform/login",
                json={"login": login, "password": password},
                timeout=10.0
            )
            
            print(f"Status code: {response.status_code}")
            print(f"Response: {response.text[:200]}")
            
            if response.status_code == 200:
                data = response.json()
                print("[OK] API login successful!")
                print(f"   Token: {data.get('token', '')[:50]}...")
                print(f"   Role: {data.get('role', '')}")
            else:
                print(f"[ERROR] API login failed with status {response.status_code}")
    except Exception as e:
        print(f"[ERROR] API request failed: {e}")
        import traceback
        traceback.print_exc()
    
    await close_db_pool()

if __name__ == "__main__":
    asyncio.run(test_login_flow())

