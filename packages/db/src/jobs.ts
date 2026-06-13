import type { ReminderJob } from '@debt-reminder/shared';

export class JobsRepository {
  constructor(private db: any) {}

  async getPendingJobsForDispatch(limit = 50): Promise<ReminderJob[]> {
    const { results } = await this.db.prepare(`
      SELECT * FROM reminder_jobs 
      WHERE status = 'queued' AND scheduled_for_utc <= datetime('now')
      ORDER BY scheduled_for_utc ASC LIMIT ?
    `).bind(limit).all();
    return results;
  }

  async createJob(data: Partial<ReminderJob>): Promise<void> {
    await this.db.prepare(`
      INSERT INTO reminder_jobs (id, receivable_id, customer_id, rule_id, template_id, idempotency_key, scheduled_for_utc, status, attempt_count, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'queued', 0, datetime('now'), datetime('now'))
    `).bind(
      data.id, data.receivable_id, data.customer_id, data.rule_id || null, data.template_id, data.idempotency_key, data.scheduled_for_utc
    ).run();
  }

  async checkIdempotency(key: string): Promise<boolean> {
    const res = await this.db.prepare('SELECT id FROM reminder_jobs WHERE idempotency_key = ?').bind(key).first();
    return !!res;
  }

  async markJobProcessing(id: string): Promise<void> {
    await this.db.prepare(`UPDATE reminder_jobs SET status = 'processing', updated_at = datetime('now') WHERE id = ?`).bind(id).run();
  }

  async markJobSent(id: string, provider: string, msgId: string): Promise<void> {
    await this.db.prepare(`
      UPDATE reminder_jobs 
      SET status = 'sent', provider = ?, provider_message_id = ?, sent_at = datetime('now'), updated_at = datetime('now') 
      WHERE id = ?
    `).bind(provider, msgId, id).run();
  }

  async markJobFailed(id: string, error: string, attempt: number, maxRetries = 3): Promise<void> {
    const status = attempt >= maxRetries ? 'failed' : 'queued';
    await this.db.prepare(`
      UPDATE reminder_jobs 
      SET status = ?, last_error = ?, attempt_count = ?, updated_at = datetime('now') 
      WHERE id = ?
    `).bind(status, error, attempt, id).run();
  }

  async logEmail(id: string, jobId: string, email: string, subject: string, status: string, error?: string): Promise<void> {
    await this.db.prepare(`
      INSERT INTO email_logs (id, job_id, direction, recipient_email, subject_rendered, status, error_message, created_at)
      VALUES (?, ?, 'outbound', ?, ?, ?, ?, datetime('now'))
    `).bind(id, jobId, email, subject, status, error || null).run();
  }
}
