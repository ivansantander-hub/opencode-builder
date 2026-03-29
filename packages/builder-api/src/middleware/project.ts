import { createMiddleware } from "hono/factory"
import { ProjectManager } from "../lib/project.js"
import { D1Adapter } from "../lib/storage.js"
import type { Env, Variables } from "../index.js"

export const project = createMiddleware<{ Bindings: Env; Variables: Variables }>(async (c, next) => {
  const projectId = c.req.param("id") || c.req.param("projectId")

  if (!projectId) {
    return c.json({ error: "Project ID required" }, 400)
  }

  const adapter = new D1Adapter(c.env.DB)
  const manager = new ProjectManager(adapter)
  const project = await manager.get(projectId)

  if (!project) {
    return c.json({ error: "Project not found" }, 404)
  }

  const user = c.get("user")
  if (project.owner_id !== user.id) {
    return c.json({ error: "Forbidden" }, 403)
  }

  c.set("project", { id: project.id })

  await next()
  return
})
