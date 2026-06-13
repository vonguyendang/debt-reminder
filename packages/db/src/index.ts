export * from './customers';
export * from './receivables';
export * from './config';
export * from './jobs';

export class UserRepository {
  constructor(private db: any) {}

  async findByEmail(email: string): Promise<any | null> {
    return await this.db.prepare('SELECT * FROM users WHERE email = ?').bind(email).first();
  }
}
