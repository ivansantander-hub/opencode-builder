import { Hono } from "hono"
import { zValidator } from "@hono/zod-validator"
import { z } from "zod"
import type { Env, Variables } from "../index.js"
import { project } from "../middleware/project.js"

const CreateDatabaseSchema = z.object({
  name: z.string().min(1),
  type: z.enum(["postgres", "mysql", "sqlite"]),
})

const databases = new Hono<{ Bindings: Env; Variables: Variables }>()

databases.get("/", project, async (c) => {
  return c.json({
    databases: [],
  })
})

databases.post("/", project, zValidator("json", CreateDatabaseSchema), async (c) => {
  const data = c.req.valid("json")
  const proj = c.get("project")

  return c.json(
    {
      database: {
        id: `db-${Date.now()}`,
        project_id: proj.id,
        name: data.name,
        type: data.type,
        status: "active",
        created_at: new Date().toISOString(),
      },
    },
    201,
  )
})

databases.get("/:id", project, async (c) => {
  const id = c.req.param("id")
  return c.json({
    database: {
      id,
      name: "Database",
      type: "postgres",
    },
  })
})

databases.delete("/:id", project, async (c) => {
  return c.json({ success: true })
})

export { databases }
