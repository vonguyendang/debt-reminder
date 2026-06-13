import { z } from 'zod';
import * as schemas from './schemas';

export type UserRole = z.infer<typeof schemas.UserRoleSchema>;
export type UserStatus = z.infer<typeof schemas.UserStatusSchema>;

export type LoginRequest = z.infer<typeof schemas.LoginRequestSchema>;
export type CreateCustomerRequest = z.infer<typeof schemas.CreateCustomerSchema>;
export type UpdateCustomerRequest = z.infer<typeof schemas.UpdateCustomerSchema>;

export type ReceivableStatus = z.infer<typeof schemas.ReceivableStatusSchema>;
export type CreateReceivableRequest = z.infer<typeof schemas.CreateReceivableSchema>;
export type UpdateReceivableRequest = z.infer<typeof schemas.UpdateReceivableSchema>;

export type RuleTriggerType = z.infer<typeof schemas.RuleTriggerTypeSchema>;
export type CreateRuleRequest = z.infer<typeof schemas.CreateRuleSchema>;
export type UpdateRuleRequest = z.infer<typeof schemas.UpdateRuleSchema>;

export type CreateTemplateRequest = z.infer<typeof schemas.CreateTemplateSchema>;
export type UpdateTemplateRequest = z.infer<typeof schemas.UpdateTemplateSchema>;

export type JobStatus = z.infer<typeof schemas.JobStatusSchema>;
export type LogStatus = z.infer<typeof schemas.LogStatusSchema>;

// DB Entities
export interface User {
  id: string;
  email: string;
  password_hash: string;
  full_name: string;
  role: UserRole;
  status: UserStatus;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  code: string | null;
  full_name: string;
  email: string;
  phone: string | null;
  company_name: string | null;
  timezone: string;
  status: 'active' | 'inactive';
  note: string | null;
  created_at: string;
  updated_at: string;
}

export interface Receivable {
  id: string;
  customer_id: string;
  title: string;
  description: string | null;
  amount_cents: number;
  currency: string;
  due_date: string;
  status: ReceivableStatus;
  paid_at: string | null;
  note: string | null;
  created_at: string;
  updated_at: string;
}

export interface ReminderRule {
  id: string;
  name: string;
  trigger_type: RuleTriggerType;
  offset_minutes: number;
  is_active: number;
  template_id: string;
  created_at: string;
  updated_at: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject_template: string;
  html_template: string;
  text_template: string | null;
  is_active: number;
  created_at: string;
  updated_at: string;
}

export interface ReminderJob {
  id: string;
  receivable_id: string;
  customer_id: string;
  rule_id: string | null;
  template_id: string;
  idempotency_key: string;
  scheduled_for_utc: string;
  status: JobStatus;
  attempt_count: number;
  provider: string | null;
  provider_message_id: string | null;
  last_error: string | null;
  sent_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface EmailLog {
  id: string;
  job_id: string;
  direction: string;
  provider: string | null;
  provider_message_id: string | null;
  recipient_email: string;
  subject_rendered: string;
  status: LogStatus;
  error_message: string | null;
  created_at: string;
}

export interface SystemSetting {
  key: string;
  value: string;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  actor_user_id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  metadata_json: string | null;
  created_at: string;
}
