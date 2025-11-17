# PowerShell скрипт для настройки локального окружения
# Использование: .\setup-local-env.ps1

Write-Host "=== Настройка локального окружения ===" -ForegroundColor Green
Write-Host ""

# Core Backend
Write-Host "Настройка Core Backend..." -ForegroundColor Yellow
if (-not (Test-Path "core-backend\.env")) {
    if (Test-Path "core-backend\.env.example") {
        Copy-Item "core-backend\.env.example" "core-backend\.env"
        Write-Host "✅ Создан core-backend\.env из .env.example" -ForegroundColor Green
    } else {
        Write-Host "⚠️ core-backend\.env.example не найден" -ForegroundColor Yellow
    }
} else {
    Write-Host "✅ core-backend\.env уже существует" -ForegroundColor Green
}

# Создание виртуального окружения для core backend
if (-not (Test-Path "core-backend\venv")) {
    Write-Host "Создание виртуального окружения для core backend..." -ForegroundColor Yellow
    Set-Location core-backend
    python -m venv venv
    Set-Location ..
    Write-Host "✅ Виртуальное окружение создано" -ForegroundColor Green
} else {
    Write-Host "✅ Виртуальное окружение core backend уже существует" -ForegroundColor Green
}

# Установка зависимостей core backend
Write-Host "Установка зависимостей core backend..." -ForegroundColor Yellow
Set-Location core-backend
if (Test-Path "venv\Scripts\Activate.ps1") {
    & .\venv\Scripts\Activate.ps1
    pip install --upgrade pip
    pip install -r requirements.txt
    Write-Host "✅ Зависимости core backend установлены" -ForegroundColor Green
} else {
    Write-Host "⚠️ Не удалось активировать виртуальное окружение" -ForegroundColor Yellow
}
Set-Location ..

# Core Frontend
Write-Host "Настройка Core Frontend..." -ForegroundColor Yellow
if (-not (Test-Path "core-frontend\.env.local")) {
    if (Test-Path "core-frontend\.env.example") {
        Copy-Item "core-frontend\.env.example" "core-frontend\.env.local"
        Write-Host "✅ Создан core-frontend\.env.local из .env.example" -ForegroundColor Green
    } else {
        Write-Host "⚠️ core-frontend\.env.example не найден" -ForegroundColor Yellow
    }
} else {
    Write-Host "✅ core-frontend\.env.local уже существует" -ForegroundColor Green
}

# Установка зависимостей core frontend
Write-Host "Установка зависимостей core frontend..." -ForegroundColor Yellow
Set-Location core-frontend
if (Test-Path "package.json") {
    npm install
    Write-Host "✅ Зависимости core frontend установлены" -ForegroundColor Green
} else {
    Write-Host "⚠️ package.json не найден" -ForegroundColor Yellow
}
Set-Location ..

# Shop Module Backend
Write-Host "Настройка Shop Module Backend..." -ForegroundColor Yellow
if (-not (Test-Path "modules\shop\.env")) {
    if (Test-Path "modules\shop\.env.example") {
        Copy-Item "modules\shop\.env.example" "modules\shop\.env"
        Write-Host "✅ Создан modules\shop\.env из .env.example" -ForegroundColor Green
    } else {
        Write-Host "⚠️ modules\shop\.env.example не найден" -ForegroundColor Yellow
    }
} else {
    Write-Host "✅ modules\shop\.env уже существует" -ForegroundColor Green
}

# Shop Module Frontend
Write-Host "Настройка Shop Module Frontend..." -ForegroundColor Yellow
if (-not (Test-Path "modules\shop\frontend\.env.local")) {
    if (Test-Path "modules\shop\frontend\.env.example") {
        Copy-Item "modules\shop\frontend\.env.example" "modules\shop\frontend\.env.local"
        Write-Host "✅ Создан modules\shop\frontend\.env.local из .env.example" -ForegroundColor Green
    } else {
        Write-Host "⚠️ modules\shop\frontend\.env.example не найден" -ForegroundColor Yellow
    }
} else {
    Write-Host "✅ modules\shop\frontend\.env.local уже существует" -ForegroundColor Green
}

Write-Host ""
Write-Host "=== Настройка завершена ===" -ForegroundColor Green
Write-Host ""
Write-Host "Следующие шаги:" -ForegroundColor Yellow
Write-Host "1. Проверьте и отредактируйте .env файлы" -ForegroundColor White
Write-Host "2. Убедитесь, что PostgreSQL запущен" -ForegroundColor White
Write-Host "3. Выполните миграции: cd core-backend && alembic upgrade head" -ForegroundColor White
Write-Host "4. Запустите сервисы: .\start-local-dev.ps1" -ForegroundColor White
Write-Host ""


