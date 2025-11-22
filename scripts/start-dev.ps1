# PowerShell скрипт для запуска всех сервисов в режиме разработки (Windows)

Write-Host "🚀 Starting Tochka Rosta Development Environment..." -ForegroundColor Green

# Проверка Docker
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Docker is not installed" -ForegroundColor Red
    exit 1
}

# Запуск инфраструктуры
Write-Host "📦 Starting infrastructure (PostgreSQL, Redis)..." -ForegroundColor Cyan
docker-compose up -d

# Ожидание готовности БД
Write-Host "⏳ Waiting for PostgreSQL..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Backend
Write-Host "🔧 Starting Backend..." -ForegroundColor Cyan
Set-Location core-backend
if (-not (Test-Path "venv")) {
    Write-Host "Creating virtual environment..."
    python -m venv venv
}
& .\venv\Scripts\Activate.ps1
pip install -r requirements.txt --quiet

# Применение миграций
Write-Host "📊 Applying database migrations..." -ForegroundColor Cyan
alembic upgrade head

# Инициализация тарифов
Write-Host "💰 Initializing tariffs..." -ForegroundColor Cyan
python -m app.modules.billing.init_data

# Запуск backend в фоне
Write-Host "✅ Starting Backend on port 8000..." -ForegroundColor Green
Start-Process python -ArgumentList "-m", "uvicorn", "app.main:app", "--reload", "--port", "8000" -WindowStyle Hidden
Set-Location ..

# Frontend
Write-Host "🎨 Starting Frontend..." -ForegroundColor Cyan
Set-Location core-frontend
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing frontend dependencies..."
    npm install --silent
}
Start-Process npm -ArgumentList "run", "dev" -WindowStyle Hidden
Set-Location ..

# Gateway
Write-Host "🌐 Starting Gateway..." -ForegroundColor Cyan
Set-Location gateway
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing gateway dependencies..."
    npm install --silent
}
Start-Process npm -ArgumentList "run", "dev" -WindowStyle Hidden
Set-Location ..

Write-Host ""
Write-Host "✅ All services started!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 Services:" -ForegroundColor Yellow
Write-Host "   - Backend:  http://localhost:8000"
Write-Host "   - Frontend: http://localhost:7000"
Write-Host "   - Gateway:  http://localhost:3000"
Write-Host "   - API Docs: http://localhost:8000/docs"
Write-Host ""
Write-Host "Press Ctrl+C to stop" -ForegroundColor Gray







