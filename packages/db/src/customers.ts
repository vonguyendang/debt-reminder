import type { Customer, CreateCustomerRequest } from '@debt-reminder/shared';

export class CustomerRepository {
  constructor(private db: any) {}

  async findById(id: string): Promise<Customer | null> {
    return await this.db.prepare('SELECT * FROM customers WHERE id = ?').bind(id).first();
  }

  async list(page = 1, pageSize = 20, status?: string): Promise<Customer[]> {
    let query = 'SELECT * FROM customers';
    const params: any[] = [];
    if (status) {
      query += ' WHERE status = ?';
      params.push(status);
    }
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(pageSize, (page - 1) * pageSize);
    const { results } = await this.db.prepare(query).bind(...params).all();
    return results;
  }

  async create(id: string, data: CreateCustomerRequest): Promise<void> {
    await this.db.prepare(`
      INSERT INTO customers (id, code, full_name, email, phone, company_name, timezone, note, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `).bind(
      id, data.code || null, data.full_name, data.email, data.phone || null,
      data.company_name || null, data.timezone || 'Asia/Ho_Chi_Minh', data.note || null
    ).run();
  }

  async update(id: string, data: Partial<CreateCustomerRequest> & { status?: string }): Promise<void> {
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
    
    await this.db.prepare(`UPDATE customers SET ${updates.join(', ')} WHERE id = ?`).bind(...params).run();
  }

  async delete(id: string): Promise<void> {
    await this.db.prepare(`DELETE FROM customers WHERE id = ?`).bind(id).run();
  }
}
