# Скрипт для запуска PostgreSQL через Docker

Write-Host "=== Запуск PostgreSQL через Docker ===" -ForegroundColor Cyan
Write-Host ""

# Проверка Docker
Write-Host "Проверка Docker..."
try {
    $dockerVersion = docker --version 2>&1
    Write-Host "✅ Docker установлен: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker не найден. Установите Docker Desktop." -ForegroundColor Red
    exit 1
}

# Ожидание запуска Docker Desktop
Write-Host "`nОжидание запуска Docker Desktop..."
$maxAttempts = 30
$attempt = 0
$dockerReady = $false

while ($attempt -lt $maxAttempts -and -not $dockerReady) {
    try {
        docker ps > $null 2>&1
        if ($LASTEXITCODE -eq 0) {
            $dockerReady = $true
            Write-Host "✅ Docker Desktop запущен!" -ForegroundColor Green
        } else {
            Write-Host "   Попытка $($attempt + 1)/$maxAttempts... Ожидание Docker Desktop..." -ForegroundColor Yellow
            Start-Sleep -Seconds 2
        }
    } catch {
        Write-Host "   Попытка $($attempt + 1)/$maxAttempts... Ожидание Docker Desktop..." -ForegroundColor Yellow
        Start-Sleep -Seconds 2
    }
    $attempt++
}

if (-not $dockerReady) {
    Write-Host "`n❌ Docker Desktop не запустился за 60 секунд." -ForegroundColor Red
    Write-Host "Пожалуйста, запустите Docker Desktop вручную и попробуйте снова." -ForegroundColor Yellow
    exit 1
}

# Проверка существующего контейнера
Write-Host "`nПроверка существующего контейнера..."
$existingContainer = docker ps -a --filter "name=postgres-platform" --format "{{.Names}}" 2>&1

if ($existingContainer -eq "postgres-platform") {
    Write-Host "Найден существующий контейнер postgres-platform" -ForegroundColor Yellow
    
    # Проверка, запущен ли контейнер
    $running = docker ps --filter "name=postgres-platform" --format "{{.Names}}" 2>&1
    if ($running -eq "postgres-platform") {
        Write-Host "✅ Контейнер уже запущен!" -ForegroundColor Green
    } else {
        Write-Host "Запуск существующего контейнера..." -ForegroundColor Yellow
        docker start postgres-platform 2>&1 | Out-Null
        Start-Sleep -Seconds 2
        Write-Host "✅ Контейнер запущен!" -ForegroundColor Green
    }
} else {
    # Создание нового контейнера
    Write-Host "Создание нового контейнера PostgreSQL..." -ForegroundColor Yellow
    
    docker run -d `
        --name postgres-platform `
        -e POSTGRES_USER=user `
        -e POSTGRES_PASSWORD=password `
        -e POSTGRES_DB=modular_saas_core `
        -p 5432:5432 `
        postgres:15 2>&1 | Out-Null
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Контейнер PostgreSQL создан и запущен!" -ForegroundColor Green
        Write-Host "   Ожидание готовности базы данных..." -ForegroundColor Yellow
        Start-Sleep -Seconds 5
    } else {
        Write-Host "❌ Ошибка при создании контейнера" -ForegroundColor Red
        exit 1
    }
}

# Проверка подключения
Write-Host "`nПроверка подключения к PostgreSQL..."
$connectionTest = docker exec postgres-platform psql -U user -d modular_saas_core -c "SELECT 1;" 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ PostgreSQL готов к работе!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Подключение:" -ForegroundColor Cyan
    Write-Host "  Host: localhost" -ForegroundColor White
    Write-Host "  Port: 5432" -ForegroundColor White
    Write-Host "  User: user" -ForegroundColor White
    Write-Host "  Password: password" -ForegroundColor White
    Write-Host "  Database: modular_saas_core" -ForegroundColor White
    Write-Host ""
    Write-Host "DATABASE_URL=postgresql://user:password@localhost:5432/modular_saas_core" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Следующие шаги:" -ForegroundColor Cyan
    Write-Host "1. Примените схему базы данных:" -ForegroundColor White
    Write-Host "   psql -h localhost -U user -d modular_saas_core -f core-backend/app/db/schemas.sql" -ForegroundColor Gray
    Write-Host ""
    Write-Host "2. Создайте пользователя platform_master:" -ForegroundColor White
    Write-Host "   psql -h localhost -U user -d modular_saas_core -f core-backend/scripts/create_platform_master.sql" -ForegroundColor Gray
} else {
    Write-Host "⚠️ Контейнер запущен, но подключение не работает. Подождите несколько секунд и проверьте снова." -ForegroundColor Yellow
}


