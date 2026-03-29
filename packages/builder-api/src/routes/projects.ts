import { Hono } from "hono"
import { zValidator } from "@hono/zod-validator"
import { z } from "zod"
import { ProjectManager } from "../lib/project.js"
import { D1Adapter } from "../lib/storage.js"
import type { Env, Variables } from "../index.js"

const CreateProjectBodySchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  template: z.string(),
  settings: z.record(z.unknown()).optional(),
})

const UpdateProjectBodySchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  status: z.enum(["active", "archived", "deleted"]).optional(),
  settings: z.record(z.unknown()).optional(),
})

const app = new Hono<{ Bindings: Env; Variables: Variables }>()

app.get("/", async (c) => {
  const user = c.get("user")
  const adapter = new D1Adapter(c.env.DB)
  const manager = new ProjectManager(adapter)

  const projects = await manager.listByOwner(user.id)
  return c.json({ projects })
})

app.post("/", zValidator("json", CreateProjectBodySchema), async (c) => {
  const user = c.get("user")
  const data = c.req.valid("json")
  const adapter = new D1Adapter(c.env.DB)
  const manager = new ProjectManager(adapter)

  const project = await manager.create(user.id, data)
  return c.json({ project }, 201)
})

app.get("/:id", async (c) => {
  const id = c.req.param("id")
  const adapter = new D1Adapter(c.env.DB)
  const manager = new ProjectManager(adapter)

  const project = await manager.get(id)
  if (!project) {
    return c.json({ error: "Project not found" }, 404)
  }

  const user = c.get("user")
  if (project.owner_id !== user.id) {
    return c.json({ error: "Forbidden" }, 403)
  }

  return c.json({ project })
})

app.put("/:id", zValidator("json", UpdateProjectBodySchema), async (c) => {
  const id = c.req.param("id")
  const data = c.req.valid("json")
  const adapter = new D1Adapter(c.env.DB)
  const manager = new ProjectManager(adapter)

  const existing = await manager.get(id)
  if (!existing) {
    return c.json({ error: "Project not found" }, 404)
  }

  const user = c.get("user")
  if (existing.owner_id !== user.id) {
    return c.json({ error: "Forbidden" }, 403)
  }

  const project = await manager.update(id, data)
  return c.json({ project })
})

app.delete("/:id", async (c) => {
  const id = c.req.param("id")
  const adapter = new D1Adapter(c.env.DB)
  const manager = new ProjectManager(adapter)

  const existing = await manager.get(id)
  if (!existing) {
    return c.json({ error: "Project not found" }, 404)
  }

  const user = c.get("user")
  if (existing.owner_id !== user.id) {
    return c.json({ error: "Forbidden" }, 403)
  }

  await manager.delete(id)
  return c.json({ success: true })
})

export { app as projects }
