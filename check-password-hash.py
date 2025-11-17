"""
Проверка хеша пароля в базе данных
"""
import asyncio
import sys
import os
import bcrypt

sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'core-backend'))

from app.db.session import get_db, init_db_pool, close_db_pool

async def check_hash():
    """Проверить хеш пароля в БД"""
    await init_db_pool()
    
    login = "89535574133"
    password = "Tehnologick987"
    
    async with get_db() as db:
        result = await db.fetchrow(
            "SELECT password_hash, LENGTH(password_hash) as hash_len FROM users WHERE phone = $1",
            login
        )
        
        if result:
            db_hash = result['password_hash']
            hash_len = result['hash_len']
            
            print(f"Hash length in DB: {hash_len}")
            print(f"Hash from DB (first 60 chars): {db_hash[:60] if db_hash else 'None'}")
            print(f"Hash from DB (full): {db_hash if db_hash else 'None'}")
            
            # Проверяем, не обрезан ли хеш
            if hash_len < 60:
                print(f"[ERROR] Hash is truncated! Expected 60, got {hash_len}")
            else:
                print(f"[OK] Hash length is correct: {hash_len}")
            
            # Пробуем проверить пароль
            try:
                if isinstance(db_hash, str):
                    db_hash_bytes = db_hash.encode('utf-8')
                else:
                    db_hash_bytes = db_hash
                
                password_valid = bcrypt.checkpw(
                    password.encode('utf-8'),
                    db_hash_bytes
                )
                
                if password_valid:
                    print("[OK] Password verification successful!")
                else:
                    print("[ERROR] Password verification failed!")
                    print("Trying to create new hash and compare...")
                    
                    # Создаем новый хеш для сравнения
                    new_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
                    print(f"New hash: {new_hash.decode('utf-8')}")
                    print(f"New hash length: {len(new_hash)}")
                    
                    # Проверяем, может быть проблема в формате
                    if db_hash.startswith('$2b$') or db_hash.startswith('$2a$') or db_hash.startswith('$2y$'):
                        print("[INFO] Hash format looks correct")
                    else:
                        print("[ERROR] Hash format is incorrect!")
            except Exception as e:
                print(f"[ERROR] Exception during password check: {e}")
                import traceback
                traceback.print_exc()
        else:
            print("[ERROR] User not found in database")
    
    await close_db_pool()

if __name__ == "__main__":
    asyncio.run(check_hash())

