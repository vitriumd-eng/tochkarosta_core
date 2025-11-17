# Скрипт для запуска фронтенда
Write-Host "=== Запуск фронтенда (Next.js) ===" -ForegroundColor Cyan

$frontendDir = "core-frontend"
if (-not (Test-Path $frontendDir)) {
    Write-Host "Ошибка: директория $frontendDir не найдена" -ForegroundColor Red
    exit 1
}

Set-Location $frontendDir

# Проверяем наличие node_modules
if (-not (Test-Path "node_modules")) {
    Write-Host "Установка зависимостей..." -ForegroundColor Yellow
    npm install
}

# Запускаем dev сервер
Write-Host "`nЗапуск Next.js сервера разработки" -ForegroundColor Green
Write-Host "Нажмите Ctrl+C для остановки`n" -ForegroundColor Yellow

npm run dev

