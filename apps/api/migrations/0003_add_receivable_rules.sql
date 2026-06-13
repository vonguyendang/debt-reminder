CREATE TABLE receivable_rules (
  receivable_id TEXT NOT NULL,
  rule_id TEXT NOT NULL,
  PRIMARY KEY (receivable_id, rule_id),
  FOREIGN KEY (receivable_id) REFERENCES accounts_receivable(id) ON DELETE CASCADE,
  FOREIGN KEY (rule_id) REFERENCES reminder_rules(id) ON DELETE CASCADE
);
