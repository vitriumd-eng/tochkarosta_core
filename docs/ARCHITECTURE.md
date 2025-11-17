# Architecture Documentation

## Overview

Modular SaaS Platform with strict separation between core and modules.

## Core Responsibilities

1. **Tenant Management** - Multi-tenancy with subdomain support
2. **Subscriptions** - Billing and subscription management
3. **Module Registry** - Module registration and activation
4. **SDK** - Single contract for module-core interaction
5. **Authentication** - Phone-only auth with OTP

## Module Responsibilities

1. **Business Logic** - Module-specific functionality
2. **Data Storage** - Per-tenant module databases
3. **UI/UX** - Module frontend and themes
4. **Staff Management** - Module-local staff with PIN auth

## Communication Flow

```
Module → SDK → Core → Database
```

Modules MUST NOT:
- Import core internals directly
- Access core database directly
- Bypass SDK functions

## Database Architecture

### Core DB
- Tenants, Users, Subscriptions
- Module registry
- Tenant domains
- Audit logs

### Module DBs (per-tenant)
- Module-specific data
- Staff tables (module-local)
- Orders, products, etc.

## Security

- RS256 JWT tokens
- Short-lived access tokens (15m)
- Long-lived refresh tokens (30d) with rotation
- Rate limiting on OTP
- Blocked phones tracking

## Monitoring

- JSON-structured logs
- Correlation IDs
- Sentry for errors
- Prometheus + Grafana for metrics



