import { Hono } from "hono"
import { SignJWT } from "jose"
import { z } from "zod"
import { zValidator } from "@hono/zod-validator"
import type { Env, Variables } from "../index.js"
import { ulid } from "ulid"

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  confirmPassword: z.string().min(6),
})

const registeredUsers = new Map<string, { id: string; password: string }>()

export const authRoutes = new Hono<{ Bindings: Env; Variables: Variables }>()

authRoutes.post("/login", zValidator("json", loginSchema), async (c) => {
  const { email, password } = c.req.valid("json")

  const validEmail = c.env.VALID_EMAIL || "admin@example.com"
  const validPassword = c.env.VALID_PASSWORD || "password123"

  const registered = registeredUsers.get(email)

  const isHardcoded = email === validEmail && password === validPassword
  const isRegistered = registered && registered.password === password

  if (!isHardcoded && !isRegistered) {
    return c.json({ error: "Invalid credentials" }, 401)
  }

  const userId = isHardcoded ? `user-${email.split("@")[0]}` : registered!.id

  const token = await new SignJWT({ sub: userId, email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(new TextEncoder().encode(c.env.JWT_SECRET))

  return c.json({
    token,
    user: {
      id: userId,
      email,
    },
  })
})

authRoutes.post("/register", zValidator("json", registerSchema), async (c) => {
  const { email, password, confirmPassword } = c.req.valid("json")

  if (password !== confirmPassword) {
    return c.json({ error: "Passwords do not match" }, 400)
  }

  if (registeredUsers.has(email)) {
    return c.json({ error: "Email already registered" }, 400)
  }

  const userId = ulid()
  registeredUsers.set(email, { id: userId, password })

  const token = await new SignJWT({ sub: userId, email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(new TextEncoder().encode(c.env.JWT_SECRET))

  return c.json({
    token,
    user: {
      id: userId,
      email,
    },
  })
})
