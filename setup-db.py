"""
Скрипт для настройки базы данных
"""
import asyncio
import sys
import os

# Добавляем путь к модулям приложения
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'core-backend'))

from app.db.session import get_db, init_db_pool, close_db_pool
import asyncpg

async def apply_schema():
    """Применить схему базы данных"""
    schema_file = os.path.join('core-backend', 'app', 'db', 'schemas.sql')
    
    if not os.path.exists(schema_file):
        print(f"Файл схемы не найден: {schema_file}")
        return False
    
    print("Применение схемы базы данных...")
    with open(schema_file, 'r', encoding='utf-8') as f:
        schema_sql = f.read()
    
    try:
        async with get_db() as db:
            # Выполняем весь SQL как одну транзакцию
            # asyncpg автоматически обрабатывает множественные команды
            await db.execute(schema_sql)
            print("Схема применена успешно")
            return True
    except Exception as e:
        error_str = str(e).lower()
        # Игнорируем ошибки типа "table already exists" или "already exists"
        if 'already exists' in error_str or 'duplicate' in error_str:
            print("Предупреждение: некоторые таблицы уже существуют (это нормально)")
            return True
        else:
            print(f"Ошибка при применении схемы: {e}")
            # Попробуем выполнить команды по отдельности
            print("Попытка применить схему по частям...")
            try:
                # Удаляем комментарии
                lines = [line for line in schema_sql.split('\n') if not line.strip().startswith('--')]
                cleaned_sql = '\n'.join(lines)
                
                # Разделяем на команды по точке с запятой
                statements = []
                current_statement = ""
                for line in cleaned_sql.split('\n'):
                    current_statement += line + "\n"
                    if line.strip().endswith(';'):
                        stmt = current_statement.strip()
                        if stmt and not stmt.startswith('--'):
                            statements.append(stmt)
                        current_statement = ""
                
                # Выполняем каждую команду отдельно
                for statement in statements:
                    if statement:
                        try:
                            await db.execute(statement)
                        except Exception as se:
                            if 'already exists' not in str(se).lower() and 'duplicate' not in str(se).lower():
                                print(f"Предупреждение: {se}")
                
                print("Схема применена по частям")
                return True
            except Exception as e2:
                print(f"Ошибка при применении схемы по частям: {e2}")
                return False

async def create_platform_master():
    """Создать platform_master пользователя"""
    import bcrypt
    import uuid
    
    login = "89535574133"
    password = "Tehnologick987"
    password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    print("Создание platform_master пользователя...")
    
    try:
        async with get_db() as db:
            check_query = "SELECT id FROM users WHERE phone = $1"
            existing = await db.fetchrow(check_query, login)
            
            if existing:
                update_query = """
                    UPDATE users
                    SET password_hash = $1, role = $2
                    WHERE phone = $3
                    RETURNING id
                """
                result = await db.fetchrow(update_query, password_hash, "platform_master", login)
                print(f"Пользователь platform_master обновлен: {result['id']}")
            else:
                user_id = uuid.uuid4()
                insert_query = """
                    INSERT INTO users (id, phone, password_hash, role, phone_verified, tenant_id)
                    VALUES ($1, $2, $3, $4, TRUE, NULL)
                    RETURNING id
                """
                result = await db.fetchrow(insert_query, user_id, login, password_hash, "platform_master")
                print(f"Пользователь platform_master создан: {result['id']}")
            
            print(f"   Логин: {login}")
            print(f"   Пароль: {password}")
            print(f"   Роль: platform_master")
            return True
    except Exception as e:
        print(f"Ошибка при создании пользователя: {e}")
        import traceback
        traceback.print_exc()
        return False

async def main():
    """Основная функция"""
    print("=== Настройка базы данных ===\n")
    
    # Инициализируем пул подключений
    try:
        await init_db_pool()
        print("Подключение к базе данных установлено\n")
    except Exception as e:
        print(f"Ошибка подключения к базе данных: {e}")
        print("\nУбедитесь, что:")
        print("  1. Docker Desktop запущен")
        print("  2. PostgreSQL контейнер запущен: docker ps")
        print("  3. Контейнер слушает на порту 5432")
        return 1
    
    # Применяем схему
    if not await apply_schema():
        print("\nПредупреждение: возможны проблемы при применении схемы")
    
    print()
    
    # Создаем platform_master
    if not await create_platform_master():
        print("\nПредупреждение: возможны проблемы при создании пользователя")
    
    # Закрываем пул
    await close_db_pool()
    
    print("\n=== База данных настроена ===")
    print("База данных: modular_saas_core")
    print("Пользователь БД: user")
    print("Пароль БД: password")
    print("Порт: 5432")
    
    return 0

if __name__ == "__main__":
    exit_code = asyncio.run(main())
    sys.exit(exit_code)

