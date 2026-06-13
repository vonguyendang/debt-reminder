import { z } from 'zod';

// Users
export const UserRoleSchema = z.enum(['admin', 'operator', 'viewer']);
export const UserStatusSchema = z.enum(['active', 'disabled']);

// Auth
export const LoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

// Customers
export const CustomerStatusSchema = z.enum(['active', 'inactive']);
export const CreateCustomerSchema = z.object({
  code: z.string().optional(),
  full_name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  company_name: z.string().optional(),
  timezone: z.string().default('Asia/Ho_Chi_Minh'),
  note: z.string().optional()
});
export const UpdateCustomerSchema = CreateCustomerSchema.partial().extend({
  status: CustomerStatusSchema.optional()
});

// Receivables
export const ReceivableStatusSchema = z.enum(['pending', 'paid', 'overdue', 'cancelled']);
export const CreateReceivableSchema = z.object({
  customer_id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  amount_cents: z.number().int().positive(),
  currency: z.string().default('VND'),
  due_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // YYYY-MM-DD
  note: z.string().optional(),
  rule_ids: z.array(z.string()).optional()
});
export const UpdateReceivableSchema = CreateReceivableSchema.partial().extend({
  status: ReceivableStatusSchema.optional()
});

// Rules
export const RuleTriggerTypeSchema = z.enum(['before_due', 'on_due', 'after_due']);
export const CreateRuleSchema = z.object({
  name: z.string().min(1),
  trigger_type: RuleTriggerTypeSchema,
  offset_minutes: z.number().int(),
  recurring_interval_minutes: z.number().int().optional(),
  template_id: z.string().min(1),
  is_active: z.number().int().min(0).max(1).default(1)
});
export const UpdateRuleSchema = CreateRuleSchema.partial();

// Templates
export const CreateTemplateSchema = z.object({
  name: z.string().min(1),
  subject_template: z.string().min(1),
  html_template: z.string().min(1),
  text_template: z.string().optional(),
  is_active: z.number().int().min(0).max(1).default(1)
});
export const UpdateTemplateSchema = CreateTemplateSchema.partial();

// Jobs
export const JobStatusSchema = z.enum(['queued', 'processing', 'sent', 'failed', 'cancelled']);

// Logs
export const LogStatusSchema = z.enum(['queued', 'sent', 'failed']);
