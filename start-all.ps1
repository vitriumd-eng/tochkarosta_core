# Скрипт для запуска всей системы
Write-Host "=== Запуск всей системы ===" -ForegroundColor Cyan
Write-Host ""

# Шаг 1: Настройка PostgreSQL
Write-Host "Шаг 1: Настройка PostgreSQL" -ForegroundColor Yellow
& ".\setup-postgres.ps1"

if ($LASTEXITCODE -ne 0) {
    Write-Host "Ошибка при настройке PostgreSQL" -ForegroundColor Red
    exit 1
}

Write-Host "`n=== Готово! ===" -ForegroundColor Green
Write-Host ""
Write-Host "Теперь запустите в ОТДЕЛЬНЫХ терминалах:" -ForegroundColor Cyan
Write-Host "  1. Бэкенд:     .\start-backend.ps1" -ForegroundColor White
Write-Host "  2. Фронтенд:   .\start-frontend.ps1" -ForegroundColor White
Write-Host ""
Write-Host "Или запустите их одновременно в разных окнах PowerShell" -ForegroundColor Yellow
Write-Host ""
Write-Host "После запуска:" -ForegroundColor Cyan
Write-Host "  - Бэкенд:     http://localhost:8000" -ForegroundColor White
Write-Host "  - Фронтенд:   http://localhost:3000" -ForegroundColor White
Write-Host "  - API Docs:   http://localhost:8000/docs" -ForegroundColor White
Write-Host "  - Dashboard:  http://localhost:3000/platform-dashboard/login" -ForegroundColor White
Write-Host ""

