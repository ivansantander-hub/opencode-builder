import { Hono } from "hono"
import { cors } from "hono/cors"
import { logger } from "hono/logger"
import { auth } from "./middleware/auth.js"
import { limits } from "./middleware/limits.js"
import { projects } from "./routes/projects.js"
import { authRoutes } from "./routes/auth.js"
import { files } from "./routes/files.js"
import { sessions } from "./routes/sessions.js"
import { messages } from "./routes/messages.js"
import { databases } from "./routes/databases.js"
import { deploys } from "./routes/deploy.js"
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

app.use("/api/builder/files/*", auth)
app.use("/api/builder/files/*", limits)
app.route("/api/builder/files", files)

app.use("/api/builder/sessions/*", auth)
app.use("/api/builder/sessions/*", limits)
app.route("/api/builder/sessions", sessions)

app.use("/api/builder/messages/*", auth)
app.use("/api/builder/messages/*", limits)
app.route("/api/builder/messages", messages)

app.use("/api/builder/databases/*", auth)
app.use("/api/builder/databases/*", limits)
app.route("/api/builder/databases", databases)

app.use("/api/builder/deploys/*", auth)
app.use("/api/builder/deploys/*", limits)
app.route("/api/builder/deploys", deploys)

export default app
