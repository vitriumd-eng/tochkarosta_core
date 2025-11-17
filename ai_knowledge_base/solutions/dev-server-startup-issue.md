# Решение: Запуск dev серверов в отдельных окнах терминала

**Problem ID:** `dev-server-startup-issue`  
**Дата решения:** 2024-12-19  
**Статус:** ✅ Полностью решено

---

## Проблема

Сервисы (Next.js Frontend и FastAPI Backend) не запускались при использовании:
- `Start-Job` - процессы завершались или не запускались корректно
- `Start-Process` с `-WindowStyle Minimized` - скрытые окна конфликтовали с интерактивными процессами

Результат: браузер показывал `chrome-error://chromewebdata/`, порты были свободны.

---

## Решение

**Запуск сервисов в отдельных окнах терминала с флагом `-NoExit`:**

```powershell
# Backend (FastAPI на порту 8000)
Start-Process powershell -NoExit -Command "cd '$PWD\core-backend'; Write-Host '=== Core Backend (Port 8000) ===' -ForegroundColor Cyan; Write-Host ''; if (Test-Path '.\venv\Scripts\Activate.ps1') { .\venv\Scripts\Activate.ps1; uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload } else { Write-Host 'ERROR: venv не найден!' -ForegroundColor Red }" -WindowStyle Normal

# Frontend Public (Next.js на порту 7000)
Start-Process powershell -NoExit -Command "cd '$PWD\core-frontend'; Write-Host '=== Core Frontend - Public (Port 7000) ===' -ForegroundColor Cyan; Write-Host ''; `$env:NEXT_DIST_DIR='.next-7000'; npm run dev" -WindowStyle Normal

# Frontend Auth (Next.js на порту 7001)
Start-Process powershell -NoExit -Command "cd '$PWD\core-frontend'; Write-Host '=== Core Frontend - Auth (Port 7001) ===' -ForegroundColor Cyan; Write-Host ''; `$env:NEXT_DIST_DIR='.next-7001'; npm run dev:auth" -WindowStyle Normal
```

---

## Почему это работает

1. **`-NoExit`** - окно терминала остается открытым, процесс не завершается при завершении команды
2. **`-WindowStyle Normal`** - окно видимо, можно видеть логи и ошибки
3. **Отдельное окно для каждого сервиса** - удобно для отладки, видно логи каждого сервиса отдельно
4. **Интерактивный режим** - dev серверы требуют терминал для вывода логов и обработки сигналов

---

## Проверка результата

После запуска все сервисы должны стать доступными:

- ✅ Backend: http://localhost:8000/health (Status: 200)
- ✅ Frontend (public): http://localhost:7000 (Status: 200)
- ✅ Frontend (auth): http://localhost:7001 (Status: 200)

---

## Важные замечания

### ❌ НЕ работает для dev серверов:

1. **Start-Job** - процессы завершаются или не запускаются корректно для долгоживущих задач
2. **Start-Process с -WindowStyle Minimized** - скрытые окна могут конфликтовать с интерактивными процессами
3. **Запуск в фоне без терминала** - dev серверы требуют интерактивного терминала

### ✅ Работает:

1. **Отдельные окна терминала с `-NoExit`** - каждый сервис в своем окне
2. **Видимые окна** (`-WindowStyle Normal`) - можно видеть логи и ошибки
3. **Правильная активация окружения** - для Backend активируется venv перед запуском

---

## Альтернативные решения

Если нужно запустить все сервисы одной командой, можно использовать:

```powershell
# Запуск всех сервисов скриптом
cd D:\tochkarosta_core
.\start-local-dev.ps1
```

Или создать PowerShell скрипт, который открывает все окна сразу.

---

**Решение проверено и работает.** ✅


