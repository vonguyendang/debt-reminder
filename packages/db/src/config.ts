import type { ReminderRule, EmailTemplate } from '@debt-reminder/shared';

export class RulesRepository {
  constructor(private db: any) {}

  async listActive(): Promise<ReminderRule[]> {
    const { results } = await this.db.prepare('SELECT * FROM reminder_rules WHERE is_active = 1 LIMIT 100').all();
    return results;
  }
  
  async listAll(): Promise<ReminderRule[]> {
    const { results } = await this.db.prepare('SELECT * FROM reminder_rules LIMIT 100').all();
    return results;
  }

  async create(id: string, data: any): Promise<void> {
    await this.db.prepare(`
      INSERT INTO reminder_rules (id, name, trigger_type, offset_minutes, recurring_interval_minutes, template_id, is_active, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `).bind(id, data.name, data.trigger_type, data.offset_minutes, data.recurring_interval_minutes || null, data.template_id, data.is_active !== undefined ? data.is_active : 1).run();
  }

  async delete(id: string): Promise<void> {
    await this.db.prepare(`DELETE FROM reminder_rules WHERE id = ?`).bind(id).run();
  }

  async update(id: string, data: any): Promise<void> {
    const updates: string[] = [];
    const params: any[] = [];
    for (const [k, v] of Object.entries(data)) {
      if (v !== undefined) {
        updates.push(`${k} = ?`);
        params.push(v);
      }
    }
    if (updates.length === 0) return;
    updates.push(`updated_at = datetime('now')`);
    params.push(id);
    
    await this.db.prepare(`UPDATE reminder_rules SET ${updates.join(', ')} WHERE id = ?`).bind(...params).run();
  }
}

export class TemplatesRepository {
  constructor(private db: any) {}

  async findById(id: string): Promise<EmailTemplate | null> {
    return await this.db.prepare('SELECT * FROM email_templates WHERE id = ?').bind(id).first();
  }

  async listAll(): Promise<EmailTemplate[]> {
    const { results } = await this.db.prepare('SELECT * FROM email_templates LIMIT 100').all();
    return results;
  }

  async create(id: string, data: any): Promise<void> {
    await this.db.prepare(`
      INSERT INTO email_templates (id, name, subject_template, html_template, text_template, is_active, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `).bind(id, data.name, data.subject_template, data.html_template, data.text_template || null, data.is_active !== undefined ? data.is_active : 1).run();
  }

  async delete(id: string): Promise<void> {
    await this.db.prepare(`DELETE FROM email_templates WHERE id = ?`).bind(id).run();
  }

  async update(id: string, data: any): Promise<void> {
    const updates: string[] = [];
    const params: any[] = [];
    for (const [k, v] of Object.entries(data)) {
      if (v !== undefined) {
        updates.push(`${k} = ?`);
        params.push(v);
      }
    }
    if (updates.length === 0) return;
    updates.push(`updated_at = datetime('now')`);
    params.push(id);
    
    await this.db.prepare(`UPDATE email_templates SET ${updates.join(', ')} WHERE id = ?`).bind(...params).run();
  }
}
