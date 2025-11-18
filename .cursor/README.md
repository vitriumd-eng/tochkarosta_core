OAuth Telegram/MAX Registration - PATCH package (ПРИМЕР)

Included files (examples, labelled ПРИМЕР):
- openapi_oauth.yaml        - OpenAPI spec addition for /api/v1/auth/oauth/{provider}
- app_api_auth_oauth.py     - FastAPI route example to add under app/api/v1/routes
- app_services_auth_service.py - Service example implementing signature validation (placeholder)
- pydantic_models.py        - Pydantic models (schemas)
- alembic_migration.sql     - Example migration to add user_external_accounts table
- gateway_oauth_forward.ts  - Gateway handler example (Node/TS) to forward to core
- frontend_nextjs.md        - Frontend snippet for Telegram WebApp flow

IMPORTANT NOTES:
- All code blocks are EXAMPLES (marked with ПРИМЕР) and must be adapted to your project.
- Run migrations and tests locally. Do NOT run in production without review.
- Update OpenAPI and generate SDK/types after merging.
