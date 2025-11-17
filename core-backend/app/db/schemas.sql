-- Core Database Schemas
-- PostgreSQL schemas for modular SaaS platform

-- Tenants table
CREATE TABLE IF NOT EXISTS tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  owner_phone VARCHAR(20) NOT NULL,
  plan TEXT,  -- NULL until module is activated
  status TEXT DEFAULT 'inactive',  -- inactive until module is activated
  active_module TEXT,  -- NULL until module is selected
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  phone VARCHAR(20) NOT NULL UNIQUE,
  phone_verified BOOLEAN DEFAULT FALSE,
  password_hash TEXT,  -- For platform_master login/password auth
  role TEXT,  -- 'platform_master', 'user', etc.
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  plan TEXT,  -- NULL for trial subscriptions
  status TEXT NOT NULL,
  started_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ,
  trial_used BOOLEAN DEFAULT FALSE
);

-- Tenant domains table
CREATE TABLE IF NOT EXISTS tenant_domains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  domain TEXT NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT TRUE,
  is_frozen BOOLEAN DEFAULT FALSE,
  frozen_until TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Modules registry table (sync with registry.yaml)
CREATE TABLE IF NOT EXISTS modules_registry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id TEXT NOT NULL UNIQUE,
  version TEXT NOT NULL,
  path TEXT NOT NULL,
  dependencies JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Module settings table (trial duration per module)
CREATE TABLE IF NOT EXISTS module_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id TEXT NOT NULL UNIQUE,
  trial_days INTEGER NOT NULL DEFAULT 14,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Platform content table (for landing page content management)
CREATE TABLE IF NOT EXISTS platform_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  content JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now(),
  updated_by UUID REFERENCES users(id) ON DELETE SET NULL
);

-- Deleted accounts history (for blocking trial abuse)
CREATE TABLE IF NOT EXISTS deleted_accounts_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone VARCHAR(20) NOT NULL,
  tenant_id UUID,
  deleted_at TIMESTAMPTZ DEFAULT now(),
  reason TEXT
);

-- Audit logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE SET NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id UUID,
  metadata JSONB,
  correlation_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_tenant_id ON users(tenant_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_tenant_id ON subscriptions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_domains_tenant_id ON tenant_domains(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_domains_domain ON tenant_domains(domain);
CREATE INDEX IF NOT EXISTS idx_audit_logs_tenant_id ON audit_logs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_correlation_id ON audit_logs(correlation_id);
CREATE INDEX IF NOT EXISTS idx_module_settings_module_id ON module_settings(module_id);
CREATE INDEX IF NOT EXISTS idx_platform_content_key ON platform_content(key);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);


