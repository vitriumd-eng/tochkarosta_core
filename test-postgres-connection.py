"""
Тест подключения к PostgreSQL
"""
import asyncio
import asyncpg
import os

async def test_connection():
    """Тест подключения к PostgreSQL"""
    print("=== ТЕСТ ПОДКЛЮЧЕНИЯ К POSTGRESQL ===")
    print()
    
    DATABASE_URL = os.getenv(
        "DATABASE_URL",
        "postgresql://user:password@localhost:5432/modular_saas_core"
    )
    
    print(f"[DB] DATABASE_URL: {DATABASE_URL.split('@')[0]}@***")
    print(f"[DB] Попытка подключения...")
    
    try:
        conn = await asyncio.wait_for(
            asyncpg.connect(DATABASE_URL),
            timeout=5.0
        )
        print("[OK] Подключение успешно!")
        
        # Проверка версии
        version = await conn.fetchval("SELECT version()")
        print(f"[OK] Версия PostgreSQL: {version.split(',')[0]}")
        
        # Проверка базы данных
        db_name = await conn.fetchval("SELECT current_database()")
        print(f"[OK] База данных: {db_name}")
        
        # Проверка пользователя
        user = await conn.fetchval("SELECT current_user")
        print(f"[OK] Пользователь: {user}")
        
        # Проверка таблицы users
        user_exists = await conn.fetchval("""
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'users'
            )
        """)
        print(f"[OK] Таблица users существует: {user_exists}")
        
        # Проверка platform_master
        if user_exists:
            platform_master = await conn.fetchrow("""
                SELECT id, phone, role 
                FROM users 
                WHERE phone = $1
            """, "89535574133")
            if platform_master:
                print(f"[OK] Пользователь platform_master найден: {platform_master['id']}")
                print(f"   Роль: {platform_master['role']}")
            else:
                print("[WARNING] Пользователь platform_master не найден")
        
        await conn.close()
        print("[OK] Подключение закрыто")
        return True
        
    except asyncio.TimeoutError:
        print("[ERROR] Таймаут подключения (5 сек)")
        print("   PostgreSQL не отвечает или недоступен")
        return False
    except Exception as e:
        print(f"[ERROR] Ошибка подключения: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    result = asyncio.run(test_connection())
    if result:
        print()
        print("[OK] PostgreSQL работает нормально!")
    else:
        print()
        print("[ERROR] Проблема с подключением к PostgreSQL")

