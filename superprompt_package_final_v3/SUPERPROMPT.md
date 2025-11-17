# SUPERPROMPT for Cursor — Modular SaaS Core (FINAL)
Generated: 2025-11-15T10:51:46.853135Z

---

# 1. MAIN RULES (immutable)
Cursor MUST follow this document. No changes to project structure, SDK, registry, ports (7000/7001/7002), or core internals without explicit user confirmation.

# 2. PROJECT STRUCTURE
root/
  core-backend/
    app/
      main.py
      auth/
      users/
      billing/
      tenants/
      subscriptions/
      modules/
        sdk.py
        registry.yaml
      logs/
      metrics/
    alembic/
    tests/
    Dockerfile
  core-frontend/
    app/
      page.tsx        # public platform (7000)
      auth/           # auth pages (7001)
      dashboard/      # tenant dashboard (7001)
      admin/          # super-admin (7002)
    lib/
      modules/
        index.ts      # frontend SDK
      api/
      dtos/
    middleware.ts
    next.config.js
    Dockerfile
  modules/
    <module-id>/
      backend/
      frontend/
      themes/
      manifest.json
  infra/
    terraform/
    k8s/
  .cursor/rules.md
  docs/

# 3. ROLES
- Core: tenant management, subscriptions, registry, SDK, billing control, feature flags, limits, monitoring.
- Modules: autonomous applications (shop, events, crm). Business logic and data live in module DBs (per-tenant).

# 4. SDK (single contract)
## Backend SDK (core-backend/app/modules/sdk.py) - REQUIRED functions:
- get_subscription_status(tenant_id) -> { active, plan, limits, features, expires }
- get_tenant_info(tenant_id) -> metadata
- get_tenant_database_url(tenant_id, module_id) -> { dsn, expires_at } (short-lived)
- check_dependencies(module_id) -> { ok, missing, inactive }
- verify_module_token(token) -> bool
- notify_tenant(tenant_id, payload)

## Frontend SDK (core-frontend/lib/modules/index.ts):
- getSubscriptionStatus(): Promise<{active, plan, limits, features}>
- getTenantInfo(): Promise<{id, domain, owner}>
- switchActiveModule(moduleId)

# 5. REGISTRY & manifest
- modules must be registered in core-backend/app/modules/registry.yaml
- modules must include manifest.json with id, name, version, dependencies, themes, publicRoutes, dashboardRoutes

# 6. DATABASES
## Core DB (PostgreSQL, managed; stores tenants, users, subscriptions, registry, domains, audit)
- Tenants table, Users, Subscriptions, Modules_registry, Tenant_domains, Deleted_accounts_history, Audit_logs
(See SCHEMAS.md for SQL)

## Module DBs (per-tenant)
- Each tenant gets its own DB for module data (shop orders, products, staff). Core does NOT store module data.
- Staff chosen storage: MODULE-LOCAL (choice A) — staff table in module DB (employee_id, pin_hash, role)

# 7. AUTH & REGISTRATION (phone-only)
- Registration flow: send_code -> verify_code -> create user + tenant -> issue access_token (RS256) + refresh_token (rotation)
- Phone in E.164 format. OTP TTL 5 minutes. Rate-limit per IP/phone. Blocked phones tracked in deleted_accounts_history to prevent trial abuse.
- Access token short-lived (15m), refresh token long (30d) with rotation & reuse detection.

# 8. TENANT MIDDLEWARE (FastAPI)
- Extract tenant by subdomain or token; set request.state.tenant_id, request.state.user_id
- Add X-Request-ID correlation id
- For DB session, set session-local variable SET LOCAL app.current_tenant = '<tenant_id>' for RLS-like queries

# 9. TARIFFS, LIMITS & FEATURES (core-controlled)
- Core returns subscription info including limits and features.
- Example response:
{ "active": true, "plan": "start", "limits": { "products": 50 }, "features": { "ai_assistant": false } }
- Modules must NOT hardcode limits; always call SDK. If SDK returns only { "active": true } modules run without limits (backwards compatible).

# 10. DOMAINS & THEMES
- Start: 1 active + 1 frozen domain (frozen retained 15 days after sub expiry; phone reserved 30 days)
- Growth: 2 active; Premium: 3 active
- Themes belong to modules; core controls which themes allowed per tariff
- On module switch, theme changes to chosen module's theme; old module theme saved and restored on reactivation

# 11. STAFF (module-local)
- Staff table in module DB; PINs hashed (argon2/bcrypt)
- Staff login endpoint: POST /auth/staff-login { employee_id, pin } returns module-scoped session token
- Staff frozen together with module on deactivation; restored on reactivation

# 12. AI keys (mode C)
- Global platform key stored in Vault; tenant may add personal key (stored in Vault)
- SDK returns effective key: user_key if present else global_key
- Track consumption per tenant; enforce rate-limits

# 13. THREE.JS GUIDELINES (for modules)
- Use GLB with Draco compression; serve via CDN; use r3f for React; LOD and lazy load; use workers for decoding; monitor FPS & memory

# 14. MONITORING & LOGS
- JSON-structured logs with tenant_id, module_id, correlation_id; Sentry for errors; Prometheus + Grafana for metrics; alerts for error spikes, high latency, DB saturation

# 15. CURSOR RULES (musts)
- Confirm before create/delete/overwrite of files
- Auto-dependency check before registering modules
- Run tests after SDK changes
- Block changes that import core internals into modules
- Provide human-readable report after each large operation

# 16. TYPICAL PROBLEMS & RESOLUTION (short)
- Form not sending: check console, CSP, MIME, preventDefault, middleware
- 500 on JS: server returned HTML; check backend logs and stacktrace id
- Token invalid: check RS256 keys, clock skew, refresh rotation
- Module activation fail: verify manifest + registry + sdk.check_dependencies

---
# APPENDICES (refer to companion files in ZIP: SCHEMAS.md, CODE_EXAMPLES.md, MODULE_TEMPLATE.md, README_FIRST.md)
