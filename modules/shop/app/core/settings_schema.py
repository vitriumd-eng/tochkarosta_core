"""
Shop Module - Settings Schema
Defines configurable settings for the module
"""
from typing import Dict, Any
from pydantic import BaseModel


class PaymentSettings(BaseModel):
    """Payment provider settings"""
    provider: str  # yookassa | p2p
    shop_id: str = ""
    secret_key: str = ""
    callback_url: str = ""


class ModuleSettings(BaseModel):
    """Module-level settings"""
    payment: PaymentSettings
    features: Dict[str, Any] = {}
    limits: Dict[str, Any] = {}


def validate_settings(settings_dict: Dict[str, Any]) -> ModuleSettings:
    """Validate and return module settings"""
    return ModuleSettings(**settings_dict)



