#!/bin/bash
# Скрипт для запуска всех сервисов в режиме разработки

echo "🚀 Starting Tochka Rosta Development Environment..."

# Проверка Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed"
    exit 1
fi

# Запуск инфраструктуры
echo "📦 Starting infrastructure (PostgreSQL, Redis)..."
docker-compose up -d

# Ожидание готовности БД
echo "⏳ Waiting for PostgreSQL..."
sleep 5

# Backend
echo "🔧 Starting Backend..."
cd core-backend
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python -m venv venv
fi
source venv/bin/activate
pip install -r requirements.txt > /dev/null 2>&1

# Применение миграций
echo "📊 Applying database migrations..."
alembic upgrade head

# Инициализация тарифов
echo "💰 Initializing tariffs..."
python -m app.modules.billing.init_data

# Запуск backend в фоне
echo "✅ Starting Backend on port 8000..."
python -m uvicorn app.main:app --reload --port 8000 &
BACKEND_PID=$!
cd ..

# Frontend
echo "🎨 Starting Frontend..."
cd core-frontend
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install > /dev/null 2>&1
fi
npm run dev &
FRONTEND_PID=$!
cd ..

# Gateway
echo "🌐 Starting Gateway..."
cd gateway
if [ ! -d "node_modules" ]; then
    echo "Installing gateway dependencies..."
    npm install > /dev/null 2>&1
fi
npm run dev &
GATEWAY_PID=$!
cd ..

echo ""
echo "✅ All services started!"
echo ""
echo "📍 Services:"
echo "   - Backend:  http://localhost:8000"
echo "   - Frontend: http://localhost:7000"
echo "   - Gateway:  http://localhost:3000"
echo "   - API Docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop all services"

# Ожидание сигнала завершения
trap "kill $BACKEND_PID $FRONTEND_PID $GATEWAY_PID; docker-compose down; exit" INT TERM

wait







