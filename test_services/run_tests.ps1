# PowerShell скрипт для автоматического тестирования

Write-Host "=== Тестирование регистрации ===" -ForegroundColor Cyan

$coreStubUrl = "http://localhost:8001"
$moduleServiceUrl = "http://localhost:8000"

# Шаг 1: Запрос кода
Write-Host "`nШаг 1: Запрос кода для Telegram" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$coreStubUrl/auth/request_code" -Method POST -ContentType "application/json" -Body '{"channel":"telegram","identifier":"@tester"}'
    Write-Host "✓ Код запрошен успешно" -ForegroundColor Green
    Write-Host "⚠️  Проверьте логи сервера - там должен быть код!" -ForegroundColor Yellow
    Write-Host "Ответ: $($response | ConvertTo-Json)"
} catch {
    Write-Host "✗ Ошибка: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Шаг 2: Подтверждение кода
Write-Host "`nШаг 2: Подтверждение кода (используем 123456 для теста)" -ForegroundColor Yellow
Write-Host "⚠️  ВАЖНО: Используйте реальный код из логов!" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$coreStubUrl/auth/confirm_code" -Method POST -ContentType "application/json" -Body '{"channel":"telegram","identifier":"@tester","code":"123456"}'
    Write-Host "✓ Код подтвержден!" -ForegroundColor Green
    Write-Host "Tenant ID: $($response.tenant_id)" -ForegroundColor Cyan
    $tenantId = $response.tenant_id
} catch {
    Write-Host "✗ Ошибка: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "💡 Попробуйте запросить новый код и использовать его из логов" -ForegroundColor Yellow
    exit 1
}

# Шаг 3: Активация модуля
Write-Host "`nШаг 3: Активация модуля" -ForegroundColor Yellow
try {
    $subdomain = "test-shop-$(Get-Random -Minimum 1000 -Maximum 9999)"
    Write-Host "Используем поддомен: $subdomain" -ForegroundColor Cyan
    $body = @{
        tenant_id = $tenantId
        module = "shop"
        plan = "basic"
        subdomain = $subdomain
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$coreStubUrl/modules/activate" -Method POST -ContentType "application/json" -Body $body
    Write-Host "✓ Модуль активирован!" -ForegroundColor Green
    Write-Host "Ответ: $($response | ConvertTo-Json -Depth 3)"
} catch {
    Write-Host "✗ Ошибка: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Шаг 4: Проверка регистрации в модуле
Write-Host "`nШаг 4: Проверка регистрации в модуле" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$moduleServiceUrl/admin/tenants" -Method GET
    Write-Host "✓ Tenants получены:" -ForegroundColor Green
    $response.tenants | ForEach-Object {
        Write-Host "  - Tenant ID: $($_.tenant_id)" -ForegroundColor Cyan
        Write-Host "    Plan: $($_.plan), Status: $($_.license_status), Subdomain: $($_.subdomain)"
    }
} catch {
    Write-Host "✗ Ошибка: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== Тестирование завершено ===" -ForegroundColor Cyan
Write-Host "Tenant ID для использования: $tenantId" -ForegroundColor Green


