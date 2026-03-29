import type { D1Database } from "@cloudflare/workers-types"

export class D1Adapter {
  constructor(private db: D1Database) {}

  async query<T>(sql: string, params?: unknown[]): Promise<{ rows: T[]; rowCount: number }> {
    const stmt = this.db.prepare(sql)
    const result = params?.length ? stmt.bind(...params) : stmt
    const rows = await result.all()
    return {
      rows: (rows.results || []) as T[],
      rowCount: rows.results?.length || 0,
    }
  }

  async execute(sql: string, params?: unknown[]): Promise<void> {
    const stmt = this.db.prepare(sql)
    const result = params?.length ? stmt.bind(...params) : stmt
    await result.run()
  }
}
