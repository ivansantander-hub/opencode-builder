import { describe, it, expect, beforeEach } from "vitest"
import { MemoryAdapter } from "../../src/storage/memory-adapter"

describe("MemoryAdapter", () => {
  let adapter: MemoryAdapter

  beforeEach(() => {
    adapter = new MemoryAdapter()
  })

  describe("query", () => {
    it("should return empty array for new table", async () => {
      const result = await adapter.query("SELECT * FROM test_table")
      expect(result.rows).toEqual([])
      expect(result.rowCount).toBe(0)
    })

    it("should return inserted rows", async () => {
      await adapter.execute("CREATE TABLE test_table")
      adapter.insert("test_table", { id: "1", name: "Test" })

      const result = await adapter.query("SELECT * FROM test_table")
      expect(result.rows).toHaveLength(1)
      expect(result.rows[0]).toEqual({ id: "1", name: "Test" })
    })
  })

  describe("execute", () => {
    it("should create table", async () => {
      await adapter.execute("CREATE TABLE new_table")
      const result = await adapter.query("SELECT * FROM new_table")
      expect(result.rows).toEqual([])
    })

    it("should handle CREATE TABLE idempotently", async () => {
      await adapter.execute("CREATE TABLE test")
      await adapter.execute("CREATE TABLE test")
      const result = await adapter.query("SELECT * FROM test")
      expect(result.rows).toEqual([])
    })
  })

  describe("transaction", () => {
    it("should execute function within transaction", async () => {
      const result = await adapter.transaction(async (tx) => {
        await tx.execute("CREATE TABLE tx_test")
        return "success"
      })

      expect(result).toBe("success")
    })

    it("should propagate errors", async () => {
      await expect(
        adapter.transaction(async () => {
          throw new Error("Test error")
        }),
      ).rejects.toThrow("Test error")
    })
  })

  describe("clear", () => {
    it("should clear all tables", async () => {
      await adapter.execute("CREATE TABLE table1")
      await adapter.execute("CREATE TABLE table2")
      adapter.insert("table1", { id: "1" })
      adapter.insert("table2", { id: "2" })

      adapter.clear()

      const result1 = await adapter.query("SELECT * FROM table1")
      const result2 = await adapter.query("SELECT * FROM table2")
      expect(result1.rows).toEqual([])
      expect(result2.rows).toEqual([])
    })
  })

  describe("insert", () => {
    it("should insert single row", async () => {
      await adapter.execute("CREATE TABLE items")
      adapter.insert("items", { id: "1", name: "Item 1" })

      const result = await adapter.query("SELECT * FROM items")
      expect(result.rows).toHaveLength(1)
      expect(result.rows[0].name).toBe("Item 1")
    })

    it("should insert multiple rows", async () => {
      await adapter.execute("CREATE TABLE items")
      adapter.insert("items", { id: "1" })
      adapter.insert("items", { id: "2" })
      adapter.insert("items", { id: "3" })

      const result = await adapter.query("SELECT * FROM items")
      expect(result.rows).toHaveLength(3)
    })
  })
})
