-- Seed admin user
-- Password hash should be generated properly in production. For demo: 'admin123'
INSERT INTO users (id, email, password_hash, full_name, role, status, created_at, updated_at)
VALUES (
  'usr_admin1',
  'admin@example.com',
  '$2a$10$D8bF8bF8bF8bF8bF8bF8bO/z.5UvK9G/QG9.K9G/QG9.K9G/QG9.K', -- example bcrypt
  'System Admin',
  'admin',
  'active',
  datetime('now'),
  datetime('now')
);
