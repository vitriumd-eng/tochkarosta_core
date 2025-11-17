-- Script to create platform_master user
-- Run this script in PostgreSQL after database is set up
-- Example: psql -d modular_saas_core -f create_platform_master.sql

-- Create platform_master user if not exists
INSERT INTO users (id, phone, password_hash, role, phone_verified, tenant_id, created_at, updated_at)
VALUES (
    gen_random_uuid(),
    '89535574133',
    '$2b$12$/SSg7PUfMpMrY61dwG..c.uBu9YAQeXZ0jf7DVV8T2HUAIeXtS1q.', -- bcrypt hash for 'Tehnologick987'
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

-- Note: The password hash above is for 'Tehnologick987'
-- Login: 89535574133
-- Password: Tehnologick987
-- Role: platform_master

