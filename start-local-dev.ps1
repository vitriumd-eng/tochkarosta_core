# PowerShell скрипт для запуска локальной разработки
# Использование: .\start-local-dev.ps1

Write-Host "=== Запуск локальной среды разработки ===" -ForegroundColor Green
Write-Host ""

# Проверка наличия необходимых инструментов
Write-Host "Проверка инструментов..." -ForegroundColor Yellow

# Проверка Python
try {
    $pythonVersion = python --version 2>&1
    Write-Host "✅ Python: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Python не найден. Установите Python 3.11+" -ForegroundColor Red
    exit 1
}

# Проверка Node.js
try {
    $nodeVersion = node --version 2>&1
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js не найден. Установите Node.js 18+" -ForegroundColor Red
    exit 1
}

# Проверка PostgreSQL
try {
    $pgVersion = psql --version 2>&1
    Write-Host "✅ PostgreSQL: $pgVersion" -ForegroundColor Green
} catch {
    Write-Host "⚠️ PostgreSQL не найден. Убедитесь, что PostgreSQL запущен" -ForegroundColor Yellow
}

Write-Host ""

# Запуск PostgreSQL через Docker (если доступен)
if (Get-Command docker -ErrorAction SilentlyContinue) {
    Write-Host "Запуск PostgreSQL через Docker..." -ForegroundColor Yellow
    docker-compose -f docker-compose.local.yml up -d postgres-core postgres-shop redis
    Start-Sleep -Seconds 5
    Write-Host "✅ PostgreSQL и Redis запущены" -ForegroundColor Green
} else {
    Write-Host "⚠️ Docker не найден. Убедитесь, что PostgreSQL запущен локально" -ForegroundColor Yellow
}

Write-Host ""

# Запуск Core Backend
Write-Host "Запуск Core Backend..." -ForegroundColor Yellow
$backendJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    Set-Location core-backend
    if (Test-Path "venv\Scripts\Activate.ps1") {
        & .\venv\Scripts\Activate.ps1
    }
    uvicorn app.main:app --reload --port 8000 --host 0.0.0.0
}
Write-Host "✅ Core Backend запущен (Job ID: $($backendJob.Id))" -ForegroundColor Green

# Запуск Core Frontend (auth)
Write-Host "Запуск Core Frontend (auth)..." -ForegroundColor Yellow
$frontendJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    Set-Location core-frontend
    npm run dev:auth
}
Write-Host "✅ Core Frontend запущен (Job ID: $($frontendJob.Id))" -ForegroundColor Green

Write-Host ""
Write-Host "=== Сервисы запущены ===" -ForegroundColor Green
Write-Host ""
Write-Host "Core Backend: http://localhost:8000" -ForegroundColor Cyan
Write-Host "Core Frontend (auth): http://localhost:7001" -ForegroundColor Cyan
Write-Host "Core Frontend (public): http://localhost:7000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Для остановки сервисов используйте:" -ForegroundColor Yellow
Write-Host "  Stop-Job -Id $($backendJob.Id),$($frontendJob.Id)" -ForegroundColor White
Write-Host "  Remove-Job -Id $($backendJob.Id),$($frontendJob.Id)" -ForegroundColor White
Write-Host ""


