@echo off
echo Starting servers...

REM Запуск бэкенда в отдельном окне
start "Backend Server (Port 8000)" cmd /k "cd /d %~dp0core-backend && if exist venv\Scripts\python.exe (venv\Scripts\python.exe -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000) else (echo Virtual environment not found! && pause)"

REM Небольшая задержка перед запуском фронтенда
timeout /t 2 /nobreak >nul

REM Запуск фронтенда в отдельном окне
start "Frontend Server (Port 7000)" cmd /k "cd /d %~dp0core-frontend && npm run dev"

REM Задержка перед открытием браузера
timeout /t 5 /nobreak >nul

REM Открытие браузера
start http://localhost:7000
start http://localhost:8000/docs

echo.
echo Servers are starting in separate windows...
echo Frontend: http://localhost:7000
echo Backend API: http://localhost:8000
echo API Docs: http://localhost:8000/docs
echo.
echo Press any key to exit this window (servers will continue running)...
pause >nul



