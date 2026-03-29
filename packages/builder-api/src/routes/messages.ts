import { Hono } from "hono"
import { zValidator } from "@hono/zod-validator"
import { z } from "zod"
import type { Env, Variables } from "../index.js"

const MessageSchema = z.object({
  role: z.enum(["user", "assistant", "system"]),
  content: z.string(),
})

const messages = new Hono<{ Bindings: Env; Variables: Variables }>()

messages.get("/:sessionId", async (c) => {
  void c.req.param("sessionId")
  return c.json({
    messages: [{ id: "msg-1", role: "user", content: "Hello", created_at: new Date().toISOString() }],
  })
})

messages.post("/:sessionId", zValidator("json", MessageSchema), async (c) => {
  const sessionId = c.req.param("sessionId")
  const data = c.req.valid("json")

  return c.json(
    {
      message: {
        id: `msg-${Date.now()}`,
        session_id: sessionId,
        role: data.role,
        content: data.content,
        created_at: new Date().toISOString(),
      },
    },
    201,
  )
})

messages.delete("/:sessionId/:messageId", async (c) => {
  return c.json({ success: true })
})

export { messages }
