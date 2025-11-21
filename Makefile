.PHONY: help install dev up down migrate init-tariffs test clean

help: ## Показать справку
	@echo "Доступные команды:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

install: ## Установить все зависимости
	@echo "📦 Installing dependencies..."
	cd core-backend && python -m venv venv && . venv/bin/activate && pip install -r requirements.txt
	cd core-frontend && npm install
	cd gateway && npm install

dev: ## Запустить все сервисы в режиме разработки
	@echo "🚀 Starting development environment..."
	docker-compose up -d
	@echo "⏳ Waiting for services..."
	sleep 5
	cd core-backend && . venv/bin/activate && alembic upgrade head && python -m app.modules.billing.init_data
	@echo "✅ Services ready! Run 'make up' to start servers"

up: ## Запустить все сервисы
	@echo "🚀 Starting all services..."
	docker-compose up -d
	cd core-backend && . venv/bin/activate && python -m uvicorn app.main:app --reload &
	cd core-frontend && npm run dev &
	cd gateway && npm run dev &
	@echo "✅ Services started!"

down: ## Остановить все сервисы
	@echo "🛑 Stopping all services..."
	docker-compose down
	pkill -f "uvicorn app.main:app" || true
	pkill -f "next dev" || true
	pkill -f "npm run dev" || true
	@echo "✅ Services stopped"

migrate: ## Создать и применить миграции
	cd core-backend && . venv/bin/activate && alembic revision --autogenerate -m "$(msg)" && alembic upgrade head

init-tariffs: ## Инициализировать тарифы
	cd core-backend && . venv/bin/activate && python -m app.modules.billing.init_data

test: ## Запустить тесты (когда будут добавлены)
	@echo "🧪 Running tests..."
	@echo "Tests not implemented yet"

clean: ## Очистить временные файлы
	@echo "🧹 Cleaning..."
	find . -type d -name "__pycache__" -exec rm -r {} + 2>/dev/null || true
	find . -type f -name "*.pyc" -delete
	find . -type d -name ".next" -exec rm -r {} + 2>/dev/null || true
	find . -type d -name "node_modules" -prune -o -type d -name "dist" -exec rm -r {} + 2>/dev/null || true
	@echo "✅ Cleaned"



