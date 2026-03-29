export interface QueryResult<T> {
  rows: T[]
  rowCount: number
}

export interface StorageAdapter {
  query<T>(sql: string, params?: unknown[]): Promise<QueryResult<T>>
  execute(sql: string, params?: unknown[]): Promise<void>
  transaction<T>(fn: (adapter: StorageAdapter) => Promise<T>): Promise<T>
}

export interface StorageAdapterConfig {
  type: "d1" | "postgres" | "memory"
  connection: unknown
}
