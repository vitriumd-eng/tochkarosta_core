# Быстрый старт - Tochka Rosta

## 🚀 За 5 минут

### Вариант 1: Автоматический запуск (рекомендуется)

#### Windows
```powershell
.\scripts\start-dev.ps1
```

#### Linux/Mac
```bash
chmod +x scripts/start-dev.sh
./scripts/start-dev.sh
```

### Вариант 2: Ручной запуск

#### 1. Запустить инфраструктуру
```bash
docker-compose up -d
```

#### 2. Backend
```bash
cd core-backend
python -m venv venv
venv\Scripts\activate  # Windows
# или
source venv/bin/activate  # Linux/Mac

pip install -r requirements.txt
alembic upgrade head
python -m app.modules.billing.init_data
python -m uvicorn app.main:app --reload
```

#### 3. Frontend (новый терминал)
```bash
cd core-frontend
npm install
npm run dev
```

#### 4. Gateway (новый терминал)
```bash
cd gateway
npm install
npm run dev
```

## ✅ Проверка работы

1. **Backend API:** http://localhost:8000/docs
2. **Frontend:** http://localhost:7000
3. **Gateway:** http://localhost:3000

## 🧪 Тест регистрации

1. Откройте http://localhost:7000
2. Введите номер телефона (например: +79991234567)
3. Проверьте консоль backend - там будет OTP код
4. Введите код и завершите регистрацию

## 📝 Что дальше?

- Прочитайте [SETUP.md](SETUP.md) для детальной настройки
- Изучите [DEVELOPMENT.md](DEVELOPMENT.md) для разработки
- Посмотрите [README.md](README.md) для общей информации

## ❓ Проблемы?

См. раздел Troubleshooting в [SETUP.md](SETUP.md)







