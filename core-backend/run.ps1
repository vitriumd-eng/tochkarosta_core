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

