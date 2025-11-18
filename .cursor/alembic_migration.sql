-- ПРИМЕР alembic SQL migration for user_external_accounts
CREATE TABLE IF NOT EXISTS user_external_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  provider VARCHAR NOT NULL,
  external_id VARCHAR NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(provider, external_id)
);
