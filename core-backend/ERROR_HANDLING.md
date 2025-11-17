# Troubleshooting Internal Server Error

## Проблема: Internal Server Error при логине

### Возможные причины:

1. **База данных не подключена**
   - Проверьте, запущен ли PostgreSQL
   - Проверьте DATABASE_URL в переменных окружения
   - Проверьте логи backend сервера

2. **Пользователь platform_master не создан**
   - Выполните SQL скрипт: `psql -d modular_saas_core -f core-backend/scripts/create_platform_master.sql`
   - Или используйте Python скрипт: `python core-backend/scripts/create_platform_master.py`

3. **Проблема с JWT ключами**
   - Проверьте, что JWT_PRIVATE_KEY и JWT_PUBLIC_KEY настроены
   - Или используются placeholder ключи (для разработки)

4. **Ошибка в коде**
   - Проверьте логи backend сервера для деталей ошибки
   - Endpoint теперь должен возвращать детальную ошибку вместо "Internal Server Error"

### Как проверить:

1. **Проверить подключение к базе данных:**
   ```bash
   curl http://localhost:8000/api/platform/health
   ```

2. **Проверить логи backend:**
   - Найдите процесс uvicorn
   - Проверьте консольный вывод на наличие ошибок

3. **Проверить наличие пользователя:**
   ```sql
   SELECT id, phone, role FROM users WHERE phone = '89535574133';
   ```

### Решение:

1. Убедитесь, что база данных запущена
2. Создайте пользователя platform_master
3. Перезапустите backend сервер
4. Попробуйте войти снова


