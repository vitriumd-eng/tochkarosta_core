# Скрипт для запуска backend в отдельном окне с видимыми логами
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Запуск Backend в отдельном окне" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$backendDir = "core-backend"
if (-not (Test-Path $backendDir)) {
    Write-Host "Ошибка: директория $backendDir не найдена" -ForegroundColor Red
    exit 1
}

$backendPath = (Resolve-Path $backendDir).Path

# Останавливаем существующие процессы на порту 8000
Write-Host "Остановка существующих процессов на порту 8000..." -ForegroundColor Yellow
Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue | ForEach-Object {
    Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue
}
Start-Sleep -Seconds 2

# Создаем скрипт для запуска в новом окне
$windowScript = @"
`$ErrorActionPreference = 'Stop'
cd '$backendPath'
Write-Host '========================================' -ForegroundColor Cyan
Write-Host '   BACKEND SERVER - LOGS WINDOW' -ForegroundColor Green  
Write-Host '========================================' -ForegroundColor Cyan
Write-Host ''
Write-Host "Current directory: `$(Get-Location)" -ForegroundColor Gray
Write-Host ''
Write-Host 'Server URL: http://localhost:8000' -ForegroundColor Yellow
Write-Host 'API Docs:   http://localhost:8000/docs' -ForegroundColor Cyan
Write-Host 'Health:     http://localhost:8000/health' -ForegroundColor Cyan
Write-Host ''
Write-Host 'Checking virtual environment...' -ForegroundColor Gray
if (Test-Path 'venv\Scripts\Activate.ps1') {
    Write-Host 'Activating virtual environment...' -ForegroundColor Gray
    . venv\Scripts\Activate.ps1
    Write-Host 'Virtual environment activated ✓' -ForegroundColor Green
} else {
    Write-Host 'Warning: venv not found, creating...' -ForegroundColor Yellow
    python -m venv venv
    . venv\Scripts\Activate.ps1
    Write-Host 'Virtual environment created and activated ✓' -ForegroundColor Green
    Write-Host 'Installing dependencies...' -ForegroundColor Gray
    pip install -q -r requirements.txt
}
Write-Host ''
Write-Host 'Checking app structure...' -ForegroundColor Gray
if (Test-Path 'app\main.py') {
    Write-Host '✓ app\main.py found' -ForegroundColor Green
} else {
    Write-Host '✗ ERROR: app\main.py NOT FOUND!' -ForegroundColor Red
    Write-Host "Current directory: `$(Get-Location)" -ForegroundColor Red
    Write-Host 'Press any key to exit...' -ForegroundColor Yellow
    `$null = `$Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
    exit 1
}
Write-Host ''
Write-Host 'Starting uvicorn with auto-reload (excluded files)...' -ForegroundColor Gray
Write-Host '========================================' -ForegroundColor Cyan
Write-Host ''
Write-Host 'Все логи будут отображаться здесь' -ForegroundColor Cyan
Write-Host 'Нажмите Ctrl+C для остановки' -ForegroundColor Red
Write-Host ''
Write-Host 'Исключены из reload:' -ForegroundColor Yellow
Write-Host '  - app/api/v1/routes/auth.py' -ForegroundColor Gray
Write-Host '  - app/services/*' -ForegroundColor Gray
Write-Host '  - app/db/*' -ForegroundColor Gray
Write-Host '  - app/middleware/*' -ForegroundColor Gray
Write-Host ''
$command = @(
    "python -m uvicorn app.main:app --reload",
    "--reload-exclude app/api/v1/routes/auth.py",
    "--reload-exclude app/services",
    "--reload-exclude app/db",
    "--reload-exclude app/middleware",
    "--host 0.0.0.0",
    "--port 8000"
) -join " "

Write-Host "Запуск backend сервера..." -ForegroundColor Cyan
Invoke-Expression $command
"@

Write-Host "Запуск backend в новом окне PowerShell..." -ForegroundColor Green
Write-Host "Окно с логами будет открыто отдельно" -ForegroundColor Cyan
Write-Host ""

Start-Process powershell -ArgumentList "-NoExit", "-Command", $windowScript

Write-Host "✅ Backend запускается в отдельном окне" -ForegroundColor Green
Write-Host "Проверьте открывшееся окно PowerShell для просмотра логов" -ForegroundColor Yellow
Write-Host ""
Write-Host "Подождите 5-10 секунд, затем проверьте:" -ForegroundColor Cyan
Write-Host "  http://localhost:8000/health" -ForegroundColor White
Write-Host "  http://localhost:8000/docs" -ForegroundColor White

