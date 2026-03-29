import { describe, it, expect } from "vitest"
import { limits } from "../../src/middleware/limits"
import { Hono } from "hono"

describe("limits middleware", () => {
  it("should allow requests under rate limit", async () => {
    const app = new Hono<{ Variables: { user: { id: string } } }>()
    app.use("/test", limits)
    app.get("/test", (c) => c.json({ success: true }))

    const req = new Request("http://localhost/test", {
      // @ts-ignore - Hono extends request with context
    })
    // Simulate user being set by auth middleware
    req.user = { id: "test-user-1" }

    const res = await app.fetch(req as any, { user: { id: "test-user-1" } } as any)

    expect(res.status).toBe(200)
  })

  it("should reject requests over rate limit", async () => {
    const app = new Hono<{ Variables: { user: { id: string } } }>()
    app.use("/test", limits)
    app.get("/test", (c) => c.json({ success: true }))

    const req = new Request("http://localhost/test")

    for (let i = 0; i < 100; i++) {
      const res = await app.fetch(req as any, { user: { id: "test-user-2" } } as any)
      if (i === 99) {
        expect(res.status).toBe(429)
        const body = await res.json()
        expect(body.error).toBe("Rate limit exceeded")
      }
    }
  })
})
