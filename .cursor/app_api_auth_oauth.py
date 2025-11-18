# ПРИМЕР: app/api/v1/routes/auth_oauth.py
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional
from app.services.auth_service import auth_oauth_handler

router = APIRouter()

class ExternalAuthRequest(BaseModel):
    provider: str
    external_id: str
    username: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    signature: str

@router.post("/oauth/{provider}", response_model=dict)
async def oauth_login(provider: str, body: ExternalAuthRequest):
    # ПРИМЕР: provider path param should match body.provider
    if provider != body.provider:
        raise HTTPException(status_code=400, detail="Provider mismatch")
    result = await auth_oauth_handler(body)
    if not result:
        raise HTTPException(status_code=400, detail="Invalid signature or auth failed")
    return result
