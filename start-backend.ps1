# Скрипт для запуска бэкенда
Write-Host "=== Запуск бэкенда (FastAPI) ===" -ForegroundColor Cyan

$backendDir = "core-backend"
if (-not (Test-Path $backendDir)) {
    Write-Host "Ошибка: директория $backendDir не найдена" -ForegroundColor Red
    exit 1
}

Set-Location $backendDir

# Проверяем наличие виртуального окружения
if (-not (Test-Path "venv")) {
    Write-Host "Создание виртуального окружения..." -ForegroundColor Yellow
    python -m venv venv
}

# Активируем виртуальное окружение
Write-Host "Активация виртуального окружения..." -ForegroundColor Yellow
& ".\venv\Scripts\Activate.ps1"

# Устанавливаем зависимости
Write-Host "Проверка зависимостей..." -ForegroundColor Yellow
pip install -q -r requirements.txt

# Запускаем сервер
Write-Host "`nЗапуск FastAPI сервера на http://localhost:8000" -ForegroundColor Green
Write-Host "Документация API: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host "Нажмите Ctrl+C для остановки`n" -ForegroundColor Yellow

python -m uvicorn app.main:app --reload --port 8000 --host 0.0.0.0

