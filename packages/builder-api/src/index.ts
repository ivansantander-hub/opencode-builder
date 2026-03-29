import { Hono } from "hono"
import { cors } from "hono/cors"
import { logger } from "hono/logger"
import { auth } from "./middleware/auth.js"
import { limits } from "./middleware/limits.js"
import { projects } from "./routes/projects.js"
import { authRoutes } from "./routes/auth.js"
import type { D1Database } from "@cloudflare/workers-types"

export interface Env {
  DB: D1Database
  JWT_SECRET: string
  VALID_EMAIL?: string
  VALID_PASSWORD?: string
}

export type Variables = {
  user: { id: string; email: string }
  project: { id: string }
}

const app = new Hono<{ Bindings: Env; Variables: Variables }>()

app.use("*", logger())
app.use("*", cors({ origin: "*" }))

app.get("/", (c) => c.json({ status: "ok", service: "builder-api" }))

app.route("/api/builder/auth", authRoutes)

app.use("/api/builder/projects", auth)
app.use("/api/builder/projects", limits)

app.route("/api/builder/projects", projects)

export default app
