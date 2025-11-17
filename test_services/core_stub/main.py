# core_stub/main.py
import uuid
import secrets
import time
from datetime import datetime, timedelta

from typing import Optional
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import sqlalchemy
from databases import Database
import httpx
import logging

logging.basicConfig(level=logging.INFO)
_log = logging.getLogger("core_stub")

DATABASE_URL = "sqlite:///./core_stub.db"  # dev only
database = Database(DATABASE_URL)
metadata = sqlalchemy.MetaData()

# verification codes table
verification_codes = sqlalchemy.Table(
    "verification_codes",
    metadata,
    sqlalchemy.Column("id", sqlalchemy.String, primary_key=True),
    sqlalchemy.Column("channel", sqlalchemy.String, nullable=False),
    sqlalchemy.Column("identifier", sqlalchemy.String, nullable=False),
    sqlalchemy.Column("code", sqlalchemy.String, nullable=False),
    sqlalchemy.Column("expires_at", sqlalchemy.Float, nullable=False),  # epoch
    sqlalchemy.Column("attempts", sqlalchemy.Integer, default=0),
)

# tenants (core)
tenants = sqlalchemy.Table(
    "tenants",
    metadata,
    sqlalchemy.Column("tenant_id", sqlalchemy.String, primary_key=True),
    sqlalchemy.Column("created_at", sqlalchemy.Float, nullable=False),
)

engine = sqlalchemy.create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
metadata.create_all(engine)

app = FastAPI(title="core_stub (dev)")

# Config: where module backend lives in dev
MODULE_BACKEND_URL = "http://localhost:8000"  # adjust if module runs on different host/port

class RequestCodeIn(BaseModel):
    channel: str  # "telegram" or "max"
    identifier: str  # @username or max_id

class ConfirmCodeIn(BaseModel):
    channel: str
    identifier: str
    code: str

class DevLoginIn(BaseModel):
    email: Optional[str] = "local@test.dev"
    role: Optional[str] = "owner"

class ActivateIn(BaseModel):
    tenant_id: str
    module: str
    plan: str
    subdomain: Optional[str] = None

@app.on_event("startup")
async def startup():
    await database.connect()

@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()

@app.get("/health")
async def health():
    return {"status": "ok", "service": "core_stub"}

@app.post("/auth/request_code")
async def request_code(payload: RequestCodeIn):
    # generate 6-digit code
    code = f"{secrets.randbelow(10**6):06d}"
    expires_at = time.time() + 300  # 5 minutes
    rec_id = str(uuid.uuid4())
    query = verification_codes.insert().values(
        id=rec_id,
        channel=payload.channel,
        identifier=payload.identifier,
        code=code,
        expires_at=expires_at,
        attempts=0,
    )
    await database.execute(query)
    # send to logs (dev)
    _log.info(f"[core_stub] Sending {payload.channel} code {code} to {payload.identifier}")
    print(f"[VERIFICATION] Code for {payload.channel} {payload.identifier}: {code}")
    # Optionally: also send via mailhog or other mock
    return {"sent": True}

@app.post("/auth/confirm_code")
async def confirm_code(payload: ConfirmCodeIn):
    try:
        query = sqlalchemy.select(verification_codes).where(
            (verification_codes.c.identifier == payload.identifier) &
            (verification_codes.c.channel == payload.channel)
        ).order_by(verification_codes.c.expires_at.desc()).limit(1)
        row = await database.fetch_one(query)
        if not row:
            _log.warning(f"[core_stub] Code not found for {payload.channel}:{payload.identifier}")
            raise HTTPException(400, "code not requested")
        # check TTL
        if time.time() > row["expires_at"]:
            _log.warning(f"[core_stub] Code expired for {payload.channel}:{payload.identifier}")
            raise HTTPException(400, "code expired")
        if payload.code != row["code"]:
            # increment attempts
            await database.execute(
                verification_codes.update().where(verification_codes.c.id == row["id"]).values(
                    attempts=row["attempts"] + 1
                )
            )
            _log.warning(f"[core_stub] Invalid code for {payload.channel}:{payload.identifier}")
            raise HTTPException(400, "invalid code")
        # create tenant atomically (simple insert, dev)
        tenant_id = str(uuid.uuid4())
        q = tenants.insert().values(tenant_id=tenant_id, created_at=time.time())
        await database.execute(q)
        _log.info(f"[core_stub] tenant created: {tenant_id} for {payload.identifier}")
        return {"confirmed": True, "tenant_id": tenant_id}
    except HTTPException:
        raise
    except Exception as e:
        _log.error(f"[core_stub] Error in confirm_code: {e}", exc_info=True)
        raise HTTPException(500, detail=f"Internal server error: {str(e)}")

@app.post("/auth/dev_login")
async def dev_login(payload: DevLoginIn):
    """
    Dev-only endpoint: Quick login without registration
    Creates a temporary tenant and returns a valid token for development
    """
    # Create tenant atomically (simple insert, dev)
    tenant_id = str(uuid.uuid4())
    user_id = str(uuid.uuid4())
    q = tenants.insert().values(tenant_id=tenant_id, created_at=time.time())
    await database.execute(q)
    
    # Generate simple access token (dev mode - not real JWT)
    # In production, use proper JWT with secret
    access_token = f"dev_token_{tenant_id}_{int(time.time())}"
    
    _log.info(f"[core_stub] dev-login: tenant_id={tenant_id}, user_id={user_id}")
    
    return {
        "tenant_id": tenant_id,
        "access_token": access_token,
        "user": {
            "id": user_id,
            "email": payload.email,
            "role": payload.role
        }
    }

@app.post("/modules/activate")
async def modules_activate(payload: ActivateIn):
    # Validate tenant exists in core
    q = sqlalchemy.select(tenants).where(tenants.c.tenant_id == payload.tenant_id)
    row = await database.fetch_one(q)
    if not row:
        raise HTTPException(404, "tenant not found")
    # module activation logic (dev): call module internal register
    register_url = f"{MODULE_BACKEND_URL}/api/v1/internal/register"
    subdomain = payload.subdomain or f"dev.{payload.module}.localhost"
    register_body = {
        "tenant_id": payload.tenant_id,
        "module_name": payload.module,
        "plan": payload.plan,
        "version": "1.0.0",
        "subdomain": subdomain,
        "callbacks": {
            "license_updated": f"{MODULE_BACKEND_URL}/api/v1/webhooks/license.updated",
            "version_updated": f"{MODULE_BACKEND_URL}/api/v1/webhooks/version.updated",
        },
    }
    async with httpx.AsyncClient() as client:
        try:
            r = await client.post(register_url, json=register_body, timeout=10.0)
            r.raise_for_status()
            _log.info(f"[core_stub] Module registered: {r.json()}")
        except Exception as e:
            _log.error(f"Failed to call module register: {e}")
            raise HTTPException(500, f"module register failed: {str(e)}")
    # simulate license.updated webhook immediately after register
    license_payload = {
        "tenant_id": payload.tenant_id,
        "status": "active",
        "plan": payload.plan,
        "features": {"catalog": True},
        "limits": {"products": 1000},
    }
    webhook_url = f"{MODULE_BACKEND_URL}/api/v1/webhooks/license.updated"
    async with httpx.AsyncClient() as client:
        try:
            wr = await client.post(webhook_url, json=license_payload, timeout=10.0)
            wr.raise_for_status()
            _log.info(f"[core_stub] License webhook sent: {wr.json()}")
        except Exception as e:
            _log.error(f"Failed webhook license.updated: {e}")
            # Activation still considered OK in dev, but log error
    return {"status": "activated", "module": payload.module, "plan": payload.plan, "tenant_id": payload.tenant_id}

