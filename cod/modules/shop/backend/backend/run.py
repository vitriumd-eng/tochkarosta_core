#!/usr/bin/env python3
"""
Entry point for shop module
Starts the FastAPI application from app/main.py
"""
import uvicorn
from app.main import app

if __name__ == "__main__":
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8001,
        reload=True
    )

