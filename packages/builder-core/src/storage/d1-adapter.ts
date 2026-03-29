import type { D1Database } from "@cloudflare/workers-types"
import type { StorageAdapter, QueryResult } from "./adapter.js"

export class D1Adapter implements StorageAdapter {
  constructor(private db: D1Database) {}

  async query<T>(sql: string, params?: unknown[]): Promise<QueryResult<T>> {
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

  async transaction<T>(fn: (adapter: StorageAdapter) => Promise<T>): Promise<T> {
    await this.execute("BEGIN TRANSACTION")
    try {
      const result = await fn(this)
      await this.execute("COMMIT")
      return result
    } catch (err) {
      await this.execute("ROLLBACK")
      throw err
    }
  }
}
