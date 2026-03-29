import { createMiddleware } from "hono/factory"
import type { Env, Variables } from "../index.js"

const requestCounts = new Map<string, number[]>()

export const limits = createMiddleware<{ Bindings: Env; Variables: Variables }>(async (c, next) => {
  const user = c.get("user")
  const now = Date.now()
  const windowStart = now - 60000

  const userRequests = requestCounts.get(user.id) || []
  const recentRequests = userRequests.filter((time) => time > windowStart)

  if (recentRequests.length >= 100) {
    return c.json({ error: "Rate limit exceeded" }, 429)
  }

  recentRequests.push(now)
  requestCounts.set(user.id, recentRequests)

  await next()
  return
})
