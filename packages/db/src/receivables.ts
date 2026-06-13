import type { Receivable, CreateReceivableRequest } from '@debt-reminder/shared';

export class ReceivableRepository {
  constructor(private db: any) {}

  async findById(id: string): Promise<any | null> {
    const rec = await this.db.prepare('SELECT * FROM accounts_receivable WHERE id = ?').bind(id).first();
    if (!rec) return null;
    const rules = await this.db.prepare('SELECT rule_id FROM receivable_rules WHERE receivable_id = ?').bind(id).all();
    rec.rule_ids = rules.results.map((r: any) => r.rule_id);
    return rec;
  }

  async list(page = 1, pageSize = 100, status?: string): Promise<any[]> {
    let query = `
      SELECT r.*, c.full_name as customer_name,
      (SELECT json_group_array(rule_id) FROM receivable_rules rr WHERE rr.receivable_id = r.id) as rule_ids_json
      FROM accounts_receivable r
      LEFT JOIN customers c ON r.customer_id = c.id
    `;
    const params: any[] = [];
    if (status) {
      query += ' WHERE r.status = ?';
      params.push(status);
    }
    query += ' ORDER BY r.created_at DESC LIMIT ? OFFSET ?';
    params.push(pageSize, (page - 1) * pageSize);
    const { results } = await this.db.prepare(query).bind(...params).all();
    return results.map((r: any) => ({
      ...r,
      rule_ids: JSON.parse(r.rule_ids_json || '[]')
    }));
  }

  async create(id: string, data: CreateReceivableRequest): Promise<void> {
    await this.db.prepare(`
      INSERT INTO accounts_receivable (id, customer_id, title, description, amount_cents, currency, due_date, note, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `).bind(
      id, data.customer_id, data.title, data.description || null, data.amount_cents, data.currency || 'VND', data.due_date, data.note || null
    ).run();

    if (data.rule_ids && data.rule_ids.length > 0) {
      const stmt = this.db.prepare(`INSERT INTO receivable_rules (receivable_id, rule_id) VALUES (?, ?)`);
      const batch = data.rule_ids.map((rid: string) => stmt.bind(id, rid));
      await this.db.batch(batch);
    }
  }

  async update(id: string, data: Partial<CreateReceivableRequest> & { status?: string }): Promise<void> {
    const updates: string[] = [];
    const params: any[] = [];
    const { rule_ids, ...restData } = data;

    for (const [k, v] of Object.entries(restData)) {
      if (v !== undefined) {
        updates.push(`${k} = ?`);
        params.push(v);
      }
    }
    
    if (updates.length > 0) {
      updates.push(`updated_at = datetime('now')`);
      params.push(id);
      await this.db.prepare(`UPDATE accounts_receivable SET ${updates.join(', ')} WHERE id = ?`).bind(...params).run();
    }

    if (rule_ids !== undefined) {
      await this.db.prepare(`DELETE FROM receivable_rules WHERE receivable_id = ?`).bind(id).run();
      if (rule_ids.length > 0) {
        const stmt = this.db.prepare(`INSERT INTO receivable_rules (receivable_id, rule_id) VALUES (?, ?)`);
        const batch = rule_ids.map((rid: string) => stmt.bind(id, rid));
        await this.db.batch(batch);
      }
    }
  }

  async markPaid(id: string): Promise<void> {
    await this.db.prepare(`UPDATE accounts_receivable SET status = 'paid', paid_at = datetime('now'), updated_at = datetime('now') WHERE id = ?`).bind(id).run();
  }

  async cancel(id: string): Promise<void> {
    await this.db.prepare(`UPDATE accounts_receivable SET status = 'cancelled', updated_at = datetime('now') WHERE id = ?`).bind(id).run();
  }

  async delete(id: string): Promise<void> {
    await this.db.prepare(`DELETE FROM accounts_receivable WHERE id = ?`).bind(id).run();
  }

  async getRulesForReceivable(id: string): Promise<any[]> {
    const { results } = await this.db.prepare(`
      SELECT r.* 
      FROM reminder_rules r
      INNER JOIN receivable_rules rr ON rr.rule_id = r.id
      WHERE rr.receivable_id = ? AND r.is_active = 1
    `).bind(id).all();
    return results;
  }
}
