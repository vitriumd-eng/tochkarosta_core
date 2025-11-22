from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import uuid

class TariffResponse(BaseModel):
    id: uuid.UUID
    name: str
    price_monthly: float
    subdomain_limit: int
    is_active: bool
    features_json: Optional[str] = None

    class Config:
        from_attributes = True

class SubscriptionResponse(BaseModel):
    id: uuid.UUID
    tenant_id: uuid.UUID
    tariff_id: uuid.UUID
    start_date: datetime
    end_date: Optional[datetime] = None
    is_active: bool

    class Config:
        from_attributes = True

class SubscriptionCreateRequest(BaseModel):
    tenant_id: uuid.UUID
    tariff_id: uuid.UUID







