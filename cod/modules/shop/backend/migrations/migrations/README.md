# Module Migrations

Shop module uses Alembic for database migrations.

## Important: Module Database Isolation

**This module has its own database per tenant.** Migrations are applied only to the module database, NOT to the core database.

## Running Migrations

### Setup

1. Set environment variables:
   ```bash
   export MIGRATION_TENANT_ID="your-tenant-uuid"
   export MIGRATION_MODULE_ID="shop"  # Optional, defaults to "shop"
   ```

2. Make sure the module can access the SDK:
   - SDK should be importable from `app.modules.sdk`
   - If not, add core-backend to Python path

### Create Migration

```bash
cd modules/shop/backend
alembic revision --autogenerate -m "description"
```

### Apply Migrations

```bash
# Apply all pending migrations
alembic upgrade head

# Apply specific revision
alembic upgrade <revision>

# Rollback one revision
alembic downgrade -1

# Rollback to specific revision
alembic downgrade <revision>
```

### Check Migration Status

```bash
# Show current revision
alembic current

# Show migration history
alembic history
```

## Database URL

The database URL is obtained from the SDK function `get_tenant_database_url()`:
- Format: `{tenant_id}_{module_id}`
- Example: `tenant_123_shop`

The SDK automatically creates the database if it doesn't exist.

## Important Notes

1. **Never run migrations against core database** - migrations only affect module databases
2. **Each tenant has its own database** - migrations are applied per tenant
3. **Migrations are module-specific** - they only contain tables for this module
4. **SDK is required** - migrations use SDK to get database URL

## Troubleshooting

### Error: "MIGRATION_TENANT_ID environment variable must be set"
- Set the environment variable before running migrations
- Example: `export MIGRATION_TENANT_ID=your-tenant-uuid`

### Error: "Cannot import SDK"
- Make sure core-backend is in Python path
- Check that `app.modules.sdk` is accessible

### Error: "Database does not exist"
- The SDK should create the database automatically
- Check SDK function `get_tenant_database_url()` is working correctly

