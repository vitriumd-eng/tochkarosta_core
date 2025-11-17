# CODE EXAMPLES (Backend SDK, Frontend SDK, Auth Flow, Middleware)

## Backend SDK example (core-backend/app/modules/sdk.py)
async def get_subscription_status(tenant_id: str) -> dict:
    # Query core DB and return formatted dict
    sub = await db.fetchrow("SELECT plan,status,expires_at FROM subscriptions WHERE tenant_id=$1", tenant_id)
    if not sub:
        return {"active": False}
    return {
        "active": sub["status"] == "active",
        "plan": sub["plan"],
        "expires": str(sub["expires_at"])
    }

async def get_tenant_database_url(tenant_id: str, module_id: str) -> dict:
    # Issue short-lived credentials for per-tenant module DB (rotate user/pass)
    creds = await vault.create_db_user(tenant_id, module_id)
    dsn = f"postgresql://{creds['user']}:{creds['pass']}@{creds['host']}:{creds['port']}/{creds['db']}"
    return {"dsn": dsn, "expires_at": creds["expires_at"]}

## Frontend SDK example (core-frontend/lib/modules/index.ts)
export async function getSubscriptionStatus() {
  const res = await fetch('/api/modules/subscription', { credentials: 'include' });
  if (!res.ok) throw new Error('SDK fetch failed');
  return res.json();
}

## FastAPI registration + token issuance (simplified)
@router.post('/auth/verify')
async def verify_code(data: VerifyCode):
    valid = await sms_service.verify_otp(data.phone, data.code)
    if not valid:
        raise HTTPException(400, 'Invalid OTP')
    user = await user_service.get_or_create_by_phone(data.phone)
    tenant = await tenant_service.get_or_create_for_user(user)
    access_token = jwt_service.create_access_token({'sub': str(user.id), 'tenant': str(tenant.id)})
    refresh_token = jwt_service.create_refresh_token({'sub': str(user.id)})
    await user_service.mark_phone_verified(user.id)
    return {'access_token': access_token, 'refresh_token': refresh_token}

## Middleware tenant extraction (FastAPI)
class TenantMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        tenant_id = None
        if token:
            try:
                payload = verify_token(token)
                tenant_id = payload.get('tenant')
                request.state.user_id = payload.get('sub')
            except Exception:
                pass
        # parse subdomain fallback
        host = request.headers.get('host','')
        # implement subdomain parsing logic here
        request.state.tenant_id = tenant_id
        response = await call_next(request)
        return response
