"""
Шаблон модуля для платформы "Точка Роста"
Backend на FastAPI

ЗАМЕНИТЕ:
- MODULE_NAME на название вашего модуля
- MODULE_PORT на уникальный порт (8001, 8002, и т.д.)
- MODULE_DESCRIPTION на описание модуля
"""
from fastapi import FastAPI, Depends, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import logging
import httpx

# TODO: В продакшене использовать пакет SDK
# from tochkarosta_sdk import CoreSDK

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("module_template")

# Конфигурация модуля
MODULE_NAME = "MODULE_NAME"
MODULE_PORT = 8001  # ИЗМЕНИТЕ на уникальный порт
MODULE_DESCRIPTION = "MODULE_DESCRIPTION"

app = FastAPI(
    title=f"{MODULE_NAME} Module",
    version="1.0.0",
    description=MODULE_DESCRIPTION
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # В продакшене укажите конкретные домены
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Временная заглушка для SDK
# В реальном модуле будет использоваться CoreSDK из пакета
CORE_API_URL = "http://localhost:8000"

async def verify_tenant_token(
    authorization: Optional[str] = Header(None)
) -> dict:
    """
    Проверка JWT токена и извлечение информации о tenant
    
    ВАЖНО: В продакшене используйте SDK:
    from tochkarosta_sdk import CoreSDK
    sdk = CoreSDK()
    payload = await sdk.verify_token(token)
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing authorization")
    
    token = authorization.replace("Bearer ", "")
    
    # TODO: Использовать SDK для проверки токена
    # payload = await sdk.verify_token(token)
    # if not payload:
    #     raise HTTPException(status_code=401, detail="Invalid token")
    
    # Временная заглушка - проверка через Core API
    try:
        async with httpx.AsyncClient() as client:
            # Проверяем токен через Core API (временное решение)
            # В продакшене используйте SDK
            response = await client.get(
                f"{CORE_API_URL}/api/tenants/me",
                headers={"Authorization": f"Bearer {token}"},
                timeout=5.0
            )
            if response.status_code != 200:
                raise HTTPException(status_code=401, detail="Invalid token")
            
            tenant_data = response.json()
            return {
                "tenant_id": tenant_data.get("id"),
                "tenant_domain": tenant_data.get("domain"),
                "token": token
            }
    except httpx.RequestError:
        raise HTTPException(status_code=503, detail="Core service unavailable")

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "ok",
        "module": MODULE_NAME,
        "version": "1.0.0"
    }

@app.get("/api/data")
async def get_module_data(tenant_info: dict = Depends(verify_tenant_token)):
    """
    Пример endpoint для получения данных модуля
    
    ВАЖНО: Все данные должны быть изолированы по tenant_id
    """
    tenant_id = tenant_info["tenant_id"]
    
    # TODO: Запрос к БД модуля с фильтром по tenant_id
    # result = await db.execute(
    #     select(ModuleModel).where(ModuleModel.tenant_id == tenant_id)
    # )
    
    return {
        "tenant_id": str(tenant_id),
        "data": [
            {"id": "1", "name": "Пример данных"}
        ],
        "message": "Это пример данных модуля"
    }

@app.post("/api/data")
async def create_module_data(
    data: dict,
    tenant_info: dict = Depends(verify_tenant_token)
):
    """
    Пример endpoint для создания данных модуля
    
    ВАЖНО: Всегда сохраняйте tenant_id с данными
    """
    tenant_id = tenant_info["tenant_id"]
    
    # TODO: Создание записи в БД модуля
    # new_item = ModuleModel(
    #     tenant_id=tenant_id,
    #     ...другие поля из data...
    # )
    # db.add(new_item)
    # await db.commit()
    
    return {
        "message": "Data created",
        "tenant_id": str(tenant_id),
        "data": data
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=MODULE_PORT,
        reload=True
    )



