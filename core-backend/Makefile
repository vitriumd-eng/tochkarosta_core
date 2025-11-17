.PHONY: help install test run migrate upgrade seed clean

help:
	@echo "TochkaRosta Core Backend - Makefile Commands"
	@echo ""
	@echo "  make install    - Install dependencies"
	@echo "  make test       - Run tests"
	@echo "  make run        - Run development server"
	@echo "  make migrate    - Create new migration"
	@echo "  make upgrade    - Apply migrations"
	@echo "  make seed       - Seed database with initial data"
	@echo "  make clean      - Clean cache and temporary files"

install:
	pip install -r requirements.txt

test:
	pytest -v

run:
	uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

migrate:
	alembic revision --autogenerate -m "$(MESSAGE)"

upgrade:
	alembic upgrade head

seed:
	python -m app.db.autoseed

clean:
	find . -type d -name __pycache__ -exec rm -r {} +
	find . -type f -name "*.pyc" -delete
	find . -type f -name "*.pyo" -delete
	find . -type d -name "*.egg-info" -exec rm -r {} +
	rm -rf .pytest_cache
	rm -rf .mypy_cache





