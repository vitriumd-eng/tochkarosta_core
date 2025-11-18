# Скрипт для запуска всех серверов (backend + frontend)
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   ЗАПУСК ВСЕХ СЕРВЕРОВ" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Остановка существующих процессов
Write-Host "Остановка существующих процессов..." -ForegroundColor Yellow
Get-NetTCPConnection -LocalPort 8000,7000,7001 -ErrorAction SilentlyContinue | ForEach-Object {
    Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue
}
Start-Sleep -Seconds 2
Write-Host ""

# Запуск backend
Write-Host "1. Запуск Backend сервера..." -ForegroundColor Cyan
Start-Sleep -Seconds 1
& ".\START_BACKEND_WINDOW.ps1"
Start-Sleep -Seconds 3
Write-Host ""

# Запуск frontend на порту 7000
Write-Host "2. Запуск Frontend (порт 7000)..." -ForegroundColor Cyan
Start-Sleep -Seconds 1
$frontend7000Script = @"
cd '$PWD\core-frontend'
if (Test-Path 'node_modules') {
    npm run dev
} else {
    npm install
    npm run dev
}
"@
Start-Process powershell -ArgumentList "-NoExit", "-Command", $frontend7000Script
Start-Sleep -Seconds 2
Write-Host ""

# Запуск frontend на порту 7001
Write-Host "3. Запуск Frontend (порт 7001)..." -ForegroundColor Cyan
Start-Sleep -Seconds 1
$frontend7001Script = @"
cd '$PWD\core-frontend'
if (Test-Path 'node_modules') {
    npm run dev:auth
} else {
    npm install
    npm run dev:auth
}
"@
Start-Process powershell -ArgumentList "-NoExit", "-Command", $frontend7001Script
Start-Sleep -Seconds 2
Write-Host ""

# Окно мониторинга backend
Write-Host "4. Открытие окна мониторинга Backend..." -ForegroundColor Cyan
$backendMonitorScript = @"
cd '$PWD'
Write-Host '========================================' -ForegroundColor Cyan
Write-Host '   BACKEND MONITORING' -ForegroundColor Green
Write-Host '========================================' -ForegroundColor Cyan
Write-Host ''
Write-Host 'Проверка порта 8000:' -ForegroundColor Yellow
`$conn = Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue
if (`$conn) {
    Write-Host "  Backend: PID `$(`$conn.OwningProcess) - Работает" -ForegroundColor Green
} else {
    Write-Host "  Backend: Не запущен" -ForegroundColor Red
}
Write-Host ''
Write-Host 'Полезные команды:' -ForegroundColor Yellow
Write-Host '  • Invoke-RestMethod http://localhost:8000/health' -ForegroundColor Gray
Write-Host '  • Invoke-WebRequest http://localhost:8000/docs' -ForegroundColor Gray
Write-Host ''
Write-Host 'Нажмите любую клавишу...' -ForegroundColor Cyan
`$null = `$Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
"@
Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendMonitorScript
Start-Sleep -Seconds 1
Write-Host ""

# Окно мониторинга frontend
Write-Host "5. Открытие окна мониторинга Frontend..." -ForegroundColor Cyan
$frontendMonitorScript = @"
cd '$PWD'
Write-Host '========================================' -ForegroundColor Cyan
Write-Host '   FRONTEND MONITORING' -ForegroundColor Green
Write-Host '========================================' -ForegroundColor Cyan
Write-Host ''
Write-Host 'Проверка портов:' -ForegroundColor Yellow
`$ports = Get-NetTCPConnection -LocalPort 7000,7001 -ErrorAction SilentlyContinue
foreach (`$p in `$ports) {
    `$portNum = `$p.LocalPort
    `$pidNum = `$p.OwningProcess
    Write-Host "  Frontend `$portNum : PID `$pidNum - Работает" -ForegroundColor Green
}
Write-Host ''
Write-Host 'Полезные команды:' -ForegroundColor Yellow
Write-Host '  • Invoke-WebRequest http://localhost:7000' -ForegroundColor Gray
Write-Host '  • Invoke-WebRequest http://localhost:7001/register' -ForegroundColor Gray
Write-Host ''
Write-Host 'Нажмите любую клавишу...' -ForegroundColor Cyan
`$null = `$Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
"@
Start-Process powershell -ArgumentList "-NoExit", "-Command", $frontendMonitorScript
Start-Sleep -Seconds 1
Write-Host ""

# Итоговый статус
Start-Sleep -Seconds 5
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   СТАТУС ЗАПУСКА" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Проверка серверов..." -ForegroundColor Yellow
try {
    $backendHealth = Invoke-RestMethod -Uri "http://localhost:8000/health" -Method GET -TimeoutSec 3
    Write-Host "  ✓ Backend работает на http://localhost:8000" -ForegroundColor Green
} catch {
    Write-Host "  ⏳ Backend еще запускается..." -ForegroundColor Yellow
}

try {
    $frontend7000 = Invoke-WebRequest -Uri "http://localhost:7000" -Method GET -TimeoutSec 3 -UseBasicParsing
    Write-Host "  ✓ Frontend работает на http://localhost:7000" -ForegroundColor Green
} catch {
    Write-Host "  ⏳ Frontend (7000) еще запускается..." -ForegroundColor Yellow
}

try {
    $frontend7001 = Invoke-WebRequest -Uri "http://localhost:7001" -Method GET -TimeoutSec 3 -UseBasicParsing
    Write-Host "  ✓ Frontend работает на http://localhost:7001" -ForegroundColor Green
} catch {
    Write-Host "  ⏳ Frontend (7001) еще запускается..." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Открытые окна:" -ForegroundColor Cyan
Write-Host "  • Backend сервер (логи)" -ForegroundColor White
Write-Host "  • Frontend 7000 (логи)" -ForegroundColor White
Write-Host "  • Frontend 7001 (логи)" -ForegroundColor White
Write-Host "  • Backend мониторинг" -ForegroundColor White
Write-Host "  • Frontend мониторинг" -ForegroundColor White
Write-Host ""
Write-Host "Все серверы запущены!" -ForegroundColor Green
Write-Host ""
