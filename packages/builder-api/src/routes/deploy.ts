import { Hono } from "hono"
import { zValidator } from "@hono/zod-validator"
import { z } from "zod"
import type { Env, Variables } from "../index.js"
import { project } from "../middleware/project.js"

const DeploySchema = z.object({
  type: z.enum(["preview", "production"]),
})

const deploys = new Hono<{ Bindings: Env; Variables: Variables }>()

deploys.get("/", project, async (c) => {
  return c.json({
    deployments: [],
  })
})

deploys.post("/", project, zValidator("json", DeploySchema), async (c) => {
  const data = c.req.valid("json")
  const proj = c.get("project")

  return c.json(
    {
      deployment: {
        id: `deploy-${Date.now()}`,
        project_id: proj.id,
        type: data.type,
        status: "building",
        url: null,
        created_at: new Date().toISOString(),
      },
    },
    201,
  )
})

deploys.get("/:id", project, async (c) => {
  const id = c.req.param("id")
  return c.json({
    deployment: {
      id,
      status: "ready",
      url: "https://example.pages.dev",
    },
  })
})

deploys.delete("/:id", project, async (c) => {
  return c.json({ success: true })
})

export { deploys }
