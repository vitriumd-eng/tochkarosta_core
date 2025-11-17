# Упрощенный скрипт для настройки PostgreSQL
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

Write-Host ""
Write-Host "Настройка базы данных через Python скрипт..." -ForegroundColor Yellow
python setup-db.py

Write-Host ""
Write-Host "=== Готово! ===" -ForegroundColor Green
Write-Host ""
Write-Host "Теперь запустите:" -ForegroundColor Cyan
Write-Host "  1. Бэкенд:     .\start-backend.ps1" -ForegroundColor White
Write-Host "  2. Фронтенд:   .\start-frontend.ps1" -ForegroundColor White

