# module_service/main.py
import uuid
import logging
import json
import time
from datetime import datetime
from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
import sqlalchemy
from databases import Database

logging.basicConfig(level=logging.INFO)
_log = logging.getLogger("module_service")

DATABASE_URL = "sqlite:///./module_service.db"  # dev only
database = Database(DATABASE_URL)
metadata = sqlalchemy.MetaData()

module_tenants = sqlalchemy.Table(
    "module_tenants",
    metadata,
    sqlalchemy.Column("tenant_id", sqlalchemy.String, primary_key=True),
    sqlalchemy.Column("plan", sqlalchemy.String),
    sqlalchemy.Column("license_status", sqlalchemy.String),
    sqlalchemy.Column("features", sqlalchemy.String),  # store JSON as string for dev
    sqlalchemy.Column("subdomain", sqlalchemy.String),
    sqlalchemy.Column("created_at", sqlalchemy.Float),
)

engine = sqlalchemy.create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
metadata.create_all(engine)

app = FastAPI(title="module_service (dev)")

class RegisterIn(BaseModel):
    tenant_id: str
    module_name: str
    plan: str
    version: str
    subdomain: str
    callbacks: dict

class LicenseUpdatedIn(BaseModel):
    tenant_id: str
    status: str
    plan: str
    features: dict
    limits: dict = {}

@app.on_event("startup")
async def startup():
    await database.connect()

@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()

@app.get("/health")
async def health():
    return {"status": "ok", "service": "module_service"}

@app.post("/api/v1/internal/register")
async def internal_register(payload: RegisterIn):
    # create tenant record in module DB
    # idempotent: if exists, update
    q = sqlalchemy.select(module_tenants).where(module_tenants.c.tenant_id == payload.tenant_id)
    existing = await database.fetch_one(q)
    if existing:
        await database.execute(
            module_tenants.update().where(module_tenants.c.tenant_id == payload.tenant_id).values(
                plan=payload.plan,
                license_status="active",
                features=json.dumps(payload.callbacks),
                subdomain=payload.subdomain,
            )
        )
        _log.info(f"[module] tenant {payload.tenant_id} already existed, updated")
    else:
        await database.execute(
            module_tenants.insert().values(
                tenant_id=payload.tenant_id,
                plan=payload.plan,
                license_status="active",
                features=json.dumps(payload.callbacks),
                subdomain=payload.subdomain,
                created_at=time.time(),
            )
        )
        _log.info(f"[module] tenant {payload.tenant_id} created")
    return {"status": "ok", "ready": True}

@app.post("/api/v1/webhooks/license.updated")
async def license_updated(payload: LicenseUpdatedIn, request: Request):
    # For dev: accept and update license_cache (module_tenants table)
    q = sqlalchemy.select(module_tenants).where(module_tenants.c.tenant_id == payload.tenant_id)
    existing = await database.fetch_one(q)
    if not existing:
        raise HTTPException(404, "tenant not registered in module")
    await database.execute(
        module_tenants.update().where(module_tenants.c.tenant_id == payload.tenant_id).values(
            plan=payload.plan,
            license_status=payload.status,
            features=json.dumps(payload.features),
        )
    )
    _log.info(f"[module] license.updated applied for {payload.tenant_id}")
    return {"status": "ok"}

@app.get("/admin/tenants")
async def list_tenants():
    """List all registered tenants (for testing)"""
    q = sqlalchemy.select(module_tenants)
    rows = await database.fetch_all(q)
    tenants_list = []
    for row in rows:
        tenants_list.append({
            "tenant_id": row["tenant_id"],
            "plan": row["plan"],
            "license_status": row["license_status"],
            "subdomain": row["subdomain"],
            "features": json.loads(row["features"]) if row["features"] else {},
            "created_at": datetime.fromtimestamp(row["created_at"]).isoformat() if row["created_at"] else None,
        })
    return {"tenants": tenants_list}

