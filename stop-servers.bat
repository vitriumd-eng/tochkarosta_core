@echo off
echo Stopping servers...

REM Остановка процессов Node.js (фронтенд)
echo Stopping Node.js processes...
taskkill /F /IM node.exe 2>nul
if %errorlevel% equ 0 (
    echo Node.js processes stopped.
) else (
    echo No Node.js processes found.
)

REM Остановка процессов Python (бэкенд)
echo Stopping Python processes...
taskkill /F /IM python.exe 2>nul
if %errorlevel% equ 0 (
    echo Python processes stopped.
) else (
    echo No Python processes found.
)

REM Остановка процессов по портам
echo Stopping processes on ports 7000 and 8000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :7000 ^| findstr LISTENING') do (
    taskkill /F /PID %%a >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8000 ^| findstr LISTENING') do (
    taskkill /F /PID %%a >nul 2>&1
)

echo.
echo Servers stopped.
pause



