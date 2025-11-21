"""
Пример модуля Shop - Интернет-магазин
Backend на FastAPI, порт 8001
"""
from fastapi import FastAPI, Depends, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import logging

# Импорт SDK для взаимодействия с Ядром
# В реальном модуле это будет отдельный пакет
# from tochkarosta_sdk import CoreSDK

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("shop")

app = FastAPI(
    title="Shop Module",
    version="1.0.0",
    description="Модуль интернет-магазина для платформы Точка Роста"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Временная заглушка для SDK
# В реальном модуле будет использоваться CoreSDK
async def verify_tenant_token(authorization: Optional[str] = Header(None)) -> str:
    """Проверка токена и извлечение tenant_id"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing authorization")
    
    token = authorization.replace("Bearer ", "")
    # TODO: Использовать SDK для проверки токена
    # payload = await sdk.verify_token(token)
    # tenant_id = payload.get("tenant")
    
    # Временная заглушка
    return "tenant_id_from_token"

@app.get("/health")
async def health_check():
    return {"status": "ok", "module": "shop"}

@app.get("/api/products")
async def get_products(tenant_id: str = Depends(verify_tenant_token)):
    """
    Получить список товаров для tenant
    В реальном модуле здесь будет запрос к БД модуля
    """
    # TODO: Запрос к БД модуля с фильтром по tenant_id
    return {
        "tenant_id": tenant_id,
        "products": [
            {"id": "1", "name": "Пример товара", "price": 1000}
        ]
    }

@app.post("/api/products")
async def create_product(tenant_id: str = Depends(verify_tenant_token)):
    """Создать товар"""
    # TODO: Создание товара в БД модуля
    return {"message": "Product created", "tenant_id": tenant_id}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8001, reload=True)



