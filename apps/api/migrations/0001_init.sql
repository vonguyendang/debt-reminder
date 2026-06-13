CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'operator', 'viewer')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'disabled')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE customers (
  id TEXT PRIMARY KEY,
  code TEXT,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company_name TEXT,
  timezone TEXT DEFAULT 'Asia/Ho_Chi_Minh',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  note TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE accounts_receivable (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  amount_cents INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'VND',
  due_date TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'cancelled')),
  paid_at TEXT,
  note TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);

CREATE TABLE reminder_rules (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  trigger_type TEXT NOT NULL CHECK (trigger_type IN ('before_due', 'on_due', 'after_due')),
  offset_minutes INTEGER NOT NULL,
  is_active INTEGER NOT NULL DEFAULT 1,
  template_id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE email_templates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  subject_template TEXT NOT NULL,
  html_template TEXT NOT NULL,
  text_template TEXT,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE reminder_jobs (
  id TEXT PRIMARY KEY,
  receivable_id TEXT NOT NULL,
  customer_id TEXT NOT NULL,
  rule_id TEXT,
  template_id TEXT NOT NULL,
  idempotency_key TEXT NOT NULL UNIQUE,
  scheduled_for_utc TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'processing', 'sent', 'failed', 'cancelled')),
  attempt_count INTEGER NOT NULL DEFAULT 0,
  provider TEXT,
  provider_message_id TEXT,
  last_error TEXT,
  sent_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (receivable_id) REFERENCES accounts_receivable(id),
  FOREIGN KEY (customer_id) REFERENCES customers(id),
  FOREIGN KEY (template_id) REFERENCES email_templates(id)
);

CREATE TABLE email_logs (
  id TEXT PRIMARY KEY,
  job_id TEXT NOT NULL,
  direction TEXT NOT NULL DEFAULT 'outbound',
  provider TEXT,
  provider_message_id TEXT,
  recipient_email TEXT NOT NULL,
  subject_rendered TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('queued', 'sent', 'failed')),
  error_message TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (job_id) REFERENCES reminder_jobs(id)
);

CREATE TABLE system_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE audit_logs (
  id TEXT PRIMARY KEY,
  actor_user_id TEXT NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  metadata_json TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (actor_user_id) REFERENCES users(id)
);

CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_receivable_status_due ON accounts_receivable(status, due_date);
CREATE INDEX idx_jobs_status_schedule ON reminder_jobs(status, scheduled_for_utc);
CREATE INDEX idx_logs_job_created ON email_logs(job_id, created_at);
