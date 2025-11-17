# Scripts

## create_platform_master.py

Python script to create platform_master user.

**Requirements:**
- Database must be running
- DATABASE_URL environment variable must be set (or use default: `postgresql://user:password@localhost:5432/modular_saas_core`)

**Usage:**
```bash
cd core-backend
python -m scripts.create_platform_master
```

**Alternative - SQL script:**

If Python script doesn't work (database not running), use SQL script instead:

```bash
psql -d modular_saas_core -f scripts/create_platform_master.sql
```

Or connect to PostgreSQL and run:

```sql
INSERT INTO users (id, phone, password_hash, role, phone_verified, tenant_id, created_at, updated_at)
VALUES (
    gen_random_uuid(),
    '89535574133',
    '$2b$12$/SSg7PUfMpMrY61dwG..c.uBu9YAQeXZ0jf7DVV8T2HUAIeXtS1q.',
    'platform_master',
    TRUE,
    NULL,
    now(),
    now()
)
ON CONFLICT (phone) DO UPDATE
SET 
    password_hash = EXCLUDED.password_hash,
    role = EXCLUDED.role,
    updated_at = now();
```

**Credentials:**
- Login: `89535574133`
- Password: `Tehnologick987`
- Role: `platform_master`

