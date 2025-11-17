# PowerShell скрипт для тестирования регистрации и активации модуля
# Использование: .\test-registration-flow.ps1

$ErrorActionPreference = "Stop"

Write-Host "=== Тестирование регистрации и активации модуля ===" -ForegroundColor Green
Write-Host ""

$backendUrl = "http://localhost:8000"
$frontendUrl = "http://localhost:7001"

# Цвета для вывода
function Write-Success { param($msg) Write-Host "✅ $msg" -ForegroundColor Green }
function Write-Error { param($msg) Write-Host "❌ $msg" -ForegroundColor Red }
function Write-Info { param($msg) Write-Host "ℹ️  $msg" -ForegroundColor Cyan }
function Write-Warning { param($msg) Write-Host "⚠️  $msg" -ForegroundColor Yellow }

# Проверка доступности сервисов
Write-Host "1. Проверка доступности сервисов..." -ForegroundColor Yellow

try {
    $healthResponse = Invoke-WebRequest -Uri "$backendUrl/health" -UseBasicParsing -TimeoutSec 5
    if ($healthResponse.StatusCode -eq 200) {
        Write-Success "Backend доступен ($backendUrl)"
    }
} catch {
    Write-Error "Backend недоступен ($backendUrl). Убедитесь, что сервер запущен."
    exit 1
}

try {
    $frontendResponse = Invoke-WebRequest -Uri "$frontendUrl/register" -UseBasicParsing -TimeoutSec 5
    if ($frontendResponse.StatusCode -eq 200) {
        Write-Success "Frontend доступен ($frontendUrl/register)"
    }
} catch {
    Write-Error "Frontend недоступен ($frontendUrl). Убедитесь, что сервер запущен на порту 7001."
    exit 1
}

Write-Host ""

# Шаг 1: Request Code (Telegram)
Write-Host "2. Шаг 1: Request Code (Telegram)..." -ForegroundColor Yellow
$testChannel = "telegram"
$testIdentifier = "test_user_$(Get-Date -Format 'yyyyMMddHHmmss')"

try {
    $requestCodeBody = @{
        channel = $testChannel
        identifier = $testIdentifier
    } | ConvertTo-Json

    $requestCodeResponse = Invoke-WebRequest -Uri "$backendUrl/api/v1/auth/request_code" `
        -Method POST `
        -ContentType "application/json" `
        -Body $requestCodeBody `
        -UseBasicParsing `
        -TimeoutSec 10

    if ($requestCodeResponse.StatusCode -eq 200) {
        $requestCodeResult = $requestCodeResponse.Content | ConvertFrom-Json
        Write-Success "Код отправлен успешно"
        Write-Info "Проверьте консоль сервера для получения кода верификации"
    }
} catch {
    Write-Error "Ошибка при запросе кода: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Ответ сервера: $responseBody" -ForegroundColor Red
    }
    exit 1
}

Write-Host ""
Write-Info "Введите 6-значный код верификации из консоли сервера:"
$verificationCode = Read-Host "Код"

if ($verificationCode.Length -ne 6 -or -not ($verificationCode -match '^\d+$')) {
    Write-Error "Код должен быть 6-значным числом"
    exit 1
}

# Шаг 2: Confirm Code
Write-Host ""
Write-Host "3. Шаг 2: Confirm Code..." -ForegroundColor Yellow

try {
    $confirmCodeBody = @{
        channel = $testChannel
        identifier = $testIdentifier
        code = $verificationCode
    } | ConvertTo-Json

    $confirmCodeResponse = Invoke-WebRequest -Uri "$backendUrl/api/v1/auth/confirm_code" `
        -Method POST `
        -ContentType "application/json" `
        -Body $confirmCodeBody `
        -UseBasicParsing `
        -TimeoutSec 10

    if ($confirmCodeResponse.StatusCode -eq 200) {
        $confirmCodeResult = $confirmCodeResponse.Content | ConvertFrom-Json
        $tenantId = $confirmCodeResult.tenant_id
        Write-Success "Код подтвержден успешно"
        Write-Info "Tenant ID: $tenantId"
    }
} catch {
    Write-Error "Ошибка при подтверждении кода: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Ответ сервера: $responseBody" -ForegroundColor Red
    }
    exit 1
}

# Шаг 3: Получение списка модулей
Write-Host ""
Write-Host "4. Шаг 3: Получение списка модулей..." -ForegroundColor Yellow

try {
    # Для dev-режима можем не использовать токен
    $modulesResponse = Invoke-WebRequest -Uri "$backendUrl/api/v1/modules/list" `
        -Method GET `
        -ContentType "application/json" `
        -UseBasicParsing `
        -TimeoutSec 10

    if ($modulesResponse.StatusCode -eq 200) {
        $modulesResult = $modulesResponse.Content | ConvertFrom-Json
        $modules = if ($modulesResult.modules) { $modulesResult.modules } else { $modulesResult }
        Write-Success "Список модулей получен"
        Write-Info "Найдено модулей: $($modules.Count)"
        
        if ($modules.Count -eq 0) {
            Write-Error "Список модулей пуст"
            exit 1
        }
        
        $firstModule = $modules[0]
        $moduleId = $firstModule.id
        Write-Info "Выбран модуль: $moduleId ($($firstModule.name))"
    }
} catch {
    Write-Error "Ошибка при получении списка модулей: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Ответ сервера: $responseBody" -ForegroundColor Red
    }
    # Попробуем использовать dev-логин для получения токена
    Write-Warning "Попытка использовать dev-login..."
    
    try {
        $devLoginResponse = Invoke-WebRequest -Uri "$backendUrl/api/v1/auth/dev-login" `
            -Method POST `
            -ContentType "application/json" `
            -UseBasicParsing `
            -TimeoutSec 10
        
        if ($devLoginResponse.StatusCode -eq 200) {
            $devLoginResult = $devLoginResponse.Content | ConvertFrom-Json
            $token = $devLoginResult.token
            $tenantId = $devLoginResult.tenant_id
            Write-Success "Dev-login выполнен успешно"
            Write-Info "Tenant ID: $tenantId"
            
            # Повторный запрос с токеном
            $headers = @{
                "Authorization" = "Bearer $token"
            }
            $modulesResponse = Invoke-WebRequest -Uri "$backendUrl/api/v1/modules/list" `
                -Method GET `
                -Headers $headers `
                -ContentType "application/json" `
                -UseBasicParsing `
                -TimeoutSec 10
            
            if ($modulesResponse.StatusCode -eq 200) {
                $modulesResult = $modulesResponse.Content | ConvertFrom-Json
                $modules = if ($modulesResult.modules) { $modulesResult.modules } else { $modulesResult }
                Write-Success "Список модулей получен с токеном"
                $firstModule = $modules[0]
                $moduleId = $firstModule.id
                Write-Info "Выбран модуль: $moduleId ($($firstModule.name))"
            }
        }
    } catch {
        Write-Error "Dev-login также не удался: $($_.Exception.Message)"
        exit 1
    }
}

if (-not $moduleId) {
    Write-Error "Не удалось получить список модулей"
    exit 1
}

# Шаг 4: Активация модуля
Write-Host ""
Write-Host "5. Шаг 4: Активация модуля..." -ForegroundColor Yellow

$testSubdomain = "test-$(Get-Date -Format 'yyyyMMddHHmmss')"

try {
    $activateBody = @{
        tenant_id = $tenantId
        module = $moduleId
        plan = "basic"
        subdomain = $testSubdomain
    } | ConvertTo-Json

    $activateResponse = Invoke-WebRequest -Uri "$backendUrl/api/v1/modules/activate" `
        -Method POST `
        -ContentType "application/json" `
        -Body $activateBody `
        -UseBasicParsing `
        -TimeoutSec 30

    if ($activateResponse.StatusCode -eq 200) {
        $activateResult = $activateResponse.Content | ConvertFrom-Json
        Write-Success "Модуль активирован успешно"
        Write-Info "Модуль: $($activateResult.module)"
        Write-Info "Поддомен: $($activateResult.subdomain)"
        Write-Info "Plan: $($activateResult.plan)"
        Write-Info "Status: $($activateResult.status)"
    }
} catch {
    Write-Error "Ошибка при активации модуля: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Ответ сервера: $responseBody" -ForegroundColor Red
    }
    exit 1
}

Write-Host ""
Write-Host "=== Тестирование завершено успешно ===" -ForegroundColor Green
Write-Host ""
Write-Info "Результаты:"
Write-Host "  - Tenant ID: $tenantId" -ForegroundColor White
Write-Host "  - Module: $moduleId" -ForegroundColor White
Write-Host "  - Subdomain: $testSubdomain" -ForegroundColor White
Write-Host ""
Write-Info "Следующие шаги:"
Write-Host "  1. Откройте страницу регистрации: $frontendUrl/register" -ForegroundColor White
Write-Host "  2. Проверьте активацию модуля в дашборде" -ForegroundColor White
Write-Host ""


