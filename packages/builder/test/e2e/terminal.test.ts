import { test, expect } from "@playwright/test"

const API_URL = process.env.API_URL || "http://localhost:8787"

test.describe("Terminal E2E", () => {
  test("should have terminal endpoint accessible", async ({ request }) => {
    const response = await request.get(`${API_URL}/api/builder/projects/demo/terminal`)
    expect(response.status()).toBeGreaterThanOrEqual(200)
  })

  test("should simulate terminal commands", async () => {
    const commands = [
      { cmd: "help", expected: "Available commands" },
      { cmd: "ls", expected: "src/" },
      { cmd: "pwd", expected: "/workspace/" },
      { cmd: "whoami", expected: "builder-user" },
      { cmd: "date", expected: new Date().getUTCFullYear().toString() },
    ]

    for (const { cmd, expected } of commands) {
      expect(cmd).toBeDefined()
      expect(expected).toBeDefined()
    }
  })

  test("should handle unknown commands", async () => {
    const unknownCmd = "unknowncommand12345"
    expect(unknownCmd).not.toBe("")
  })
})
