-- Create the api_keys table
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  secret TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL CHECK (status IN ('active', 'revoked')),
  scopes TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_used TIMESTAMPTZ,
  environment TEXT NOT NULL CHECK (environment IN ('production', 'staging', 'development')),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create an index on status for faster queries
CREATE INDEX IF NOT EXISTS idx_api_keys_status ON api_keys(status);

-- Create an index on environment for faster queries
CREATE INDEX IF NOT EXISTS idx_api_keys_environment ON api_keys(environment);

-- Create an index on secret for faster lookups
CREATE INDEX IF NOT EXISTS idx_api_keys_secret ON api_keys(secret);

-- Create a trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_api_keys_updated_at
  BEFORE UPDATE ON api_keys
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert seed data (optional - you can remove this if you don't want seed data)
INSERT INTO api_keys (id, name, secret, status, scopes, created_at, last_used, environment)
VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Production API Key', 'groot_live_43fj9dhwq22n0x9p', 'active', ARRAY['read', 'write'], '2024-09-12', '2024-12-15', 'production'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Staging Integration', 'groot_test_8ddm112ay2l288de', 'active', ARRAY['read'], '2024-06-02', '2024-12-10', 'staging'),
  ('550e8400-e29b-41d4-a716-446655440003', 'Development Testing', 'groot_dev_xx330qwe992155aa', 'active', ARRAY['read', 'write', 'admin'], '2024-11-20', '2024-12-16', 'development')
ON CONFLICT (secret) DO NOTHING;

