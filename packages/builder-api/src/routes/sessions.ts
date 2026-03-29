import { Hono } from "hono"
import { zValidator } from "@hono/zod-validator"
import { z } from "zod"
import type { Env, Variables } from "../index.js"
import { project } from "../middleware/project.js"

const CreateSessionSchema = z.object({
  name: z.string().min(1),
})

const sessions = new Hono<{ Bindings: Env; Variables: Variables }>()

sessions.get("/", project, async (c) => {
  return c.json({
    sessions: [{ id: "session-1", name: "Main Session", created_at: new Date().toISOString() }],
  })
})

sessions.post("/", project, zValidator("json", CreateSessionSchema), async (c) => {
  const data = c.req.valid("json")
  const proj = c.get("project")

  return c.json(
    {
      session: {
        id: `session-${Date.now()}`,
        project_id: proj.id,
        name: data.name,
        created_at: new Date().toISOString(),
      },
    },
    201,
  )
})

sessions.get("/:id", project, async (c) => {
  const id = c.req.param("id")

  return c.json({
    session: {
      id,
      name: "Session",
    },
  })
})

sessions.delete("/:id", project, async (c) => {
  return c.json({ success: true })
})

export { sessions }
