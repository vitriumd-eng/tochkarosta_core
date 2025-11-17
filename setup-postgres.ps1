# Скрипт для настройки PostgreSQL
Write-Host "=== Настройка PostgreSQL ===" -ForegroundColor Cyan

# Проверяем, запущен ли контейнер
$container = docker ps -a --filter "name=postgres-platform" --format "{{.Names}}"
if (-not $container) {
    Write-Host "Запускаю PostgreSQL контейнер..." -ForegroundColor Yellow
    docker run -d --name postgres-platform -e POSTGRES_USER=user -e POSTGRES_PASSWORD=password -e POSTGRES_DB=modular_saas_core -p 5432:5432 postgres:15
    Write-Host "Ожидание запуска PostgreSQL (10 секунд)..." -ForegroundColor Yellow
    Start-Sleep -Seconds 10
} else {
    $running = docker ps --filter "name=postgres-platform" --format "{{.Names}}"
    if (-not $running) {
        Write-Host "Запускаю существующий контейнер..." -ForegroundColor Yellow
        docker start postgres-platform
        Start-Sleep -Seconds 5
    } else {
        Write-Host "PostgreSQL уже запущен" -ForegroundColor Green
    }
}

# Ждем, пока PostgreSQL будет готов принимать подключения
Write-Host "Ожидание готовности PostgreSQL..." -ForegroundColor Yellow
$maxAttempts = 30
$attempt = 0
$ready = $false

while ($attempt -lt $maxAttempts -and -not $ready) {
    try {
        $env:PGPASSWORD = "password"
        $result = psql -h localhost -U user -d modular_saas_core -c "SELECT 1;" 2>&1
        if ($LASTEXITCODE -eq 0) {
            $ready = $true
            Write-Host "PostgreSQL готов!" -ForegroundColor Green
        }
    } catch {
        # Игнорируем ошибки
    }
    
    if (-not $ready) {
        $attempt++
        Write-Host "Попытка $attempt/$maxAttempts..." -ForegroundColor Gray
        Start-Sleep -Seconds 1
    }
}

if (-not $ready) {
    Write-Host "Ошибка: PostgreSQL не отвечает" -ForegroundColor Red
    exit 1
}

# Применяем схему базы данных
Write-Host "`nПрименение схемы базы данных..." -ForegroundColor Yellow
$env:PGPASSWORD = "password"
$schemaFile = "core-backend\app\db\schemas.sql"
if (Test-Path $schemaFile) {
    psql -h localhost -U user -d modular_saas_core -f $schemaFile
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Схема применена успешно" -ForegroundColor Green
    } else {
        Write-Host "Предупреждение: возможны ошибки при применении схемы (если таблицы уже существуют - это нормально)" -ForegroundColor Yellow
    }
} else {
    Write-Host "Файл схемы не найден: $schemaFile" -ForegroundColor Red
}

# Создаем platform_master пользователя
Write-Host "`nСоздание platform_master пользователя..." -ForegroundColor Yellow
$scriptFile = "core-backend\scripts\create_platform_master.sql"
if (Test-Path $scriptFile) {
    psql -h localhost -U user -d modular_saas_core -f $scriptFile
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Пользователь platform_master создан успешно" -ForegroundColor Green
    } else {
        Write-Host "Предупреждение: возможны ошибки при создании пользователя" -ForegroundColor Yellow
    }
} else {
    Write-Host "Скрипт создания пользователя не найден: $scriptFile" -ForegroundColor Yellow
    Write-Host "Попытка создать через Python скрипт..." -ForegroundColor Yellow
    $pythonScript = "core-backend\scripts\create_platform_master.py"
    if (Test-Path $pythonScript) {
        Set-Location core-backend
        python scripts\create_platform_master.py
        Set-Location ..
    }
}

Write-Host "`n=== PostgreSQL настроен ===" -ForegroundColor Green
Write-Host "База данных: modular_saas_core" -ForegroundColor Cyan
Write-Host "Пользователь БД: user" -ForegroundColor Cyan
Write-Host "Пароль БД: password" -ForegroundColor Cyan
Write-Host "Порт: 5432" -ForegroundColor Cyan

