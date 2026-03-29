import { Hono } from "hono"
import { zValidator } from "@hono/zod-validator"
import { z } from "zod"
import type { Env, Variables } from "../index.js"
import { project } from "../middleware/project.js"

const FileBodySchema = z.object({
  path: z.string().min(1),
  content: z.string(),
})

const RenameBodySchema = z.object({
  path: z.string().min(1),
  newPath: z.string().min(1),
})

const files = new Hono<{ Bindings: Env; Variables: Variables }>()

files.get("/", project, async (c) => {
  return c.json({
    files: [
      { path: "src/index.ts", type: "file" },
      { path: "src/App.tsx", type: "file" },
      { path: "package.json", type: "file" },
    ],
  })
})

files.post("/", project, zValidator("json", FileBodySchema), async (c) => {
  const data = c.req.valid("json")

  return c.json({
    file: {
      path: data.path,
      content: data.content,
      created: new Date().toISOString(),
    },
  })
})

files.get("/*", project, async (c) => {
  const path = c.req.path.replace("/api/builder/files/", "")

  return c.json({
    file: {
      path,
      content: "// file content placeholder",
    },
  })
})

files.put("/*", project, zValidator("json", FileBodySchema), async (c) => {
  const data = c.req.valid("json")

  return c.json({
    file: {
      path: data.path,
      content: data.content,
      updated: new Date().toISOString(),
    },
  })
})

files.delete("/*", project, async (c) => {
  return c.json({ success: true })
})

files.post("/rename", project, zValidator("json", RenameBodySchema), async (c) => {
  const data = c.req.valid("json")

  return c.json({
    file: {
      path: data.newPath,
      oldPath: data.path,
    },
  })
})

export { files }
