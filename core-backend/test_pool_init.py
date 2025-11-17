"""Test pool initialization"""
import asyncio
import os
from dotenv import load_dotenv
from pathlib import Path
from app.db.session import init_db_pool, is_pool_initialized, get_db

load_dotenv(Path('.env'))

async def test():
    print("[1] Проверка инициализации пула...")
    print(f"    Pool initialized: {is_pool_initialized()}")
    
    print("[2] Инициализация пула...")
    try:
        await init_db_pool()
        print("[OK] Пул инициализирован")
    except Exception as e:
        print(f"[ERROR] Ошибка инициализации: {e}")
        return
    
    print(f"[3] Проверка после инициализации...")
    print(f"    Pool initialized: {is_pool_initialized()}")
    
    print("[4] Тест get_db()...")
    try:
        async with get_db() as db:
            result = await db.fetchval("SELECT 1")
            print(f"[OK] get_db() работает: {result}")
    except Exception as e:
        print(f"[ERROR] Ошибка get_db(): {type(e).__name__}: {e}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    asyncio.run(test())

