import type { StorageAdapter, QueryResult } from "./adapter.js"

interface MemoryRow {
  id: string
  [key: string]: unknown
}

export class MemoryAdapter implements StorageAdapter {
  private data: Map<string, MemoryRow[]> = new Map()

  async query<T>(sql: string, params?: unknown[]): Promise<QueryResult<T>> {
    const tableName = this.extractTableName(sql)
    const rows = this.data.get(tableName) || []

    if (!params?.length) {
      return { rows: rows as T[], rowCount: rows.length }
    }

    const filtered = rows.filter((row) => {
      // Simple WHERE handling
      if (sql.includes("WHERE")) {
        const hasOwnerId = sql.includes("owner_id")
        const hasId = sql.includes("id")

        if (hasOwnerId && sql.includes("status")) {
          // listByOwner: owner_id = ? AND status != ?
          const ownerId = params[0]
          const status = params[1]
          return row.owner_id === ownerId && row.status !== status
        }

        if (hasOwnerId) {
          return row.owner_id === params[0]
        }

        if (hasId && !sql.includes("!=")) {
          return row.id === params[0]
        }
      }

      return true
    })

    // Handle ORDER BY
    if (sql.toLowerCase().includes("order by")) {
      filtered.sort((a, b) => {
        const aVal = a.updated_at
        const bVal = b.updated_at
        return new Date(String(bVal)).getTime() - new Date(String(aVal)).getTime()
      })
    }

    return { rows: filtered as T[], rowCount: filtered.length }
  }

  async execute(sql: string, params?: unknown[]): Promise<void> {
    const lower = sql.toLowerCase()
    const tableName = this.extractTableName(sql)

    if (lower.includes("create table")) {
      if (!this.data.has(tableName)) {
        this.data.set(tableName, [])
      }
      return
    }

    if (lower.includes("insert") && params) {
      const cols = this.extractColumns(sql)
      const row: MemoryRow = { id: String(params[0]) }
      cols.forEach((col, i) => {
        row[col] = params[i]
      })
      const existing = this.data.get(tableName) || []
      existing.push(row)
      this.data.set(tableName, existing)
      return
    }

    if (lower.includes("update") && params) {
      // Find the row by id (last param)
      const id = params[params.length - 1]
      const existing = this.data.get(tableName) || []
      const idx = existing.findIndex((r) => r.id === id)

      if (idx >= 0) {
        // Parse SET clause to know which fields to update
        const setPart = sql.split(/WHERE/i)[0] ?? ""
        const setMatch = setPart.match(/SET\s+(.+)/i)

        if (setMatch?.[1]) {
          // Handle both simple SET (field = ?) and multi SET (field = ?, field = ?)
          const setParts = setMatch[1].split(",").map((s: string) => s.trim())

          // Parameters are in order: [value1, value2, ..., id]
          const valuesToSet = params.slice(0, params.length - 1)

          setParts.forEach((part: string, i: number) => {
            const [key] = part.split("=").map((s: string) => s.trim())
            if (key && valuesToSet[i] !== undefined) {
              existing[idx]![key] = valuesToSet[i]
            }
          })
        }
      }
      return
    }

    if (lower.includes("delete") && params) {
      const id = params[params.length - 1]
      const existing = this.data.get(tableName) || []
      const filtered = existing.filter((r) => r.id !== id)
      this.data.set(tableName, filtered)
      return
    }
  }

  async transaction<T>(fn: (adapter: StorageAdapter) => Promise<T>): Promise<T> {
    return fn(this)
  }

  private extractTableName(sql: string): string {
    const match = sql.match(/(?:FROM|INTO|TABLE|UPDATE)\s+(\w+)/i)
    return match?.[1] || "default"
  }

  private extractColumns(sql: string): string[] {
    const match = sql.match(/\(([^)]+)\)\s*VALUES/i)
    if (!match) return []
    return match[1]!.split(",").map((c: string) => c.trim())
  }

  clear(): void {
    this.data.clear()
  }

  insert(table: string, row: MemoryRow): void {
    const existing = this.data.get(table) || []
    existing.push(row)
    this.data.set(table, existing)
  }
}
