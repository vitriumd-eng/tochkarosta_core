@echo off
echo Starting Tochka Rosta Development Environment...
echo.

REM 1. Start Docker containers
echo [1/4] Starting infrastructure (PostgreSQL, Redis)...
docker-compose up -d

echo Waiting for the database to be ready (10 seconds)...
timeout /t 10 > nul
echo.

REM 2. Setup and start backend
echo [2/4] Setting up and starting Backend...
cd core-backend
echo   - Installing dependencies...
call venv\Scripts\python.exe -m pip install -r requirements.txt > nul
echo   - Applying database migrations...
call venv\Scripts\alembic.exe upgrade head
echo   - Starting backend server on port 8000...
start "Backend" venv\Scripts\python.exe -m uvicorn app.main:app --reload --port 8000
cd ..
echo.

REM 3. Setup and start frontend
echo [3/4] Setting up and starting Frontend...
cd core-frontend
echo   - Installing dependencies...
call npm install > nul
echo   - Starting frontend server on port 7000...
start "Frontend" npm run dev
cd ..
echo.

REM 4. Setup and start gateway
echo [4/4] Setting up and starting Gateway...
cd gateway
echo   - Installing dependencies...
call npm install > nul
echo   - Starting gateway server on port 3000...
start "Gateway" npm run dev
cd ..
echo.

echo ================================================
echo ✅ All services are starting up in new windows.
echo ================================================
echo.
echo Your application will be available at:
echo   - Frontend: http://localhost:7000
echo   - Backend:  http://localhost:8000
echo   - API Docs: http://localhost:8000/docs
echo.
echo Press any key to close this window.
pause > nul
