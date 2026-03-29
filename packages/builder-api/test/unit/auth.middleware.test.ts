import { describe, it, expect } from "vitest"
import { auth } from "../../src/middleware/auth"
import { Hono } from "hono"
import { jwtVerify, SignJWT } from "jose"

describe("auth middleware", () => {
  const createSecret = () => new TextEncoder().encode("test-secret")

  const createToken = async (payload: { sub: string; email: string }) => {
    return await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1h")
      .sign(createSecret())
  }

  it("should reject request without authorization header", async () => {
    const app = new Hono<{ Bindings: { JWT_SECRET: string } }>()
    app.use("/test", auth)
    app.get("/test", (c) => c.json({ success: true }))

    const req = new Request("http://localhost/test")
    const res = await app.fetch(req, { JWT_SECRET: "test-secret" })

    expect(res.status).toBe(401)
    const body = await res.json()
    expect(body.error).toBe("Unauthorized")
  })

  it("should reject request with invalid token format", async () => {
    const app = new Hono<{ Bindings: { JWT_SECRET: string } }>()
    app.use("/test", auth)
    app.get("/test", (c) => c.json({ success: true }))

    const req = new Request("http://localhost/test", {
      headers: { authorization: "Invalid token" },
    })
    const res = await app.fetch(req, { JWT_SECRET: "test-secret" })

    expect(res.status).toBe(401)
  })

  it("should reject request with invalid token", async () => {
    const app = new Hono<{ Bindings: { JWT_SECRET: string } }>()
    app.use("/test", auth)
    app.get("/test", (c) => c.json({ success: true }))

    const req = new Request("http://localhost/test", {
      headers: { authorization: "Bearer invalid-token" },
    })
    const res = await app.fetch(req, { JWT_SECRET: "test-secret" })

    expect(res.status).toBe(401)
    const body = await res.json()
    expect(body.error).toBe("Invalid token")
  })

  it("should allow request with valid token", async () => {
    const app = new Hono<{ Bindings: { JWT_SECRET: string }; Variables: { user: { id: string; email: string } } }>()
    app.use("/test", auth)
    app.get("/test", (c) => {
      const user = c.get("user")
      return c.json({ user })
    })

    const token = await createToken({ sub: "user-123", email: "test@example.com" })
    const req = new Request("http://localhost/test", {
      headers: { authorization: `Bearer ${token}` },
    })
    const res = await app.fetch(req, { JWT_SECRET: "test-secret" })

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.user.id).toBe("user-123")
    expect(body.user.email).toBe("test@example.com")
  })
})
