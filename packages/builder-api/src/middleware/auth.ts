import { createMiddleware } from "hono/factory"
import { jwtVerify } from "jose"
import type { Env, Variables } from "../index.js"

const errors = {
  en: {
    unauthorized: "Unauthorized",
    invalidToken: "Invalid token",
    forbidden: "Forbidden",
    rateLimit: "Rate limit exceeded",
  },
  es: {
    unauthorized: "No autorizado",
    invalidToken: "Token inválido",
    forbidden: "Acceso prohibido",
    rateLimit: "Límite de peticiones excedido",
  },
}

const getError = (key: keyof typeof errors.en): string => {
  return errors.en[key]
}

export const auth = createMiddleware<{ Bindings: Env; Variables: Variables }>(async (c, next) => {
  const authHeader = c.req.header("authorization")

  if (!authHeader?.startsWith("Bearer ")) {
    return c.json({ error: getError("unauthorized") }, 401)
  }

  const token = authHeader.slice(7)

  try {
    const secret = new TextEncoder().encode(c.env.JWT_SECRET)
    const { payload } = await jwtVerify(token, secret)

    c.set("user", {
      id: String(payload.sub || ""),
      email: String(payload.email || ""),
    })

    await next()
    return
  } catch {
    return c.json({ error: getError("invalidToken") }, 401)
  }
})
