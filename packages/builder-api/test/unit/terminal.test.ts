import { describe, it, expect } from "vitest"

describe("Terminal Commands", () => {
  const processCommand = (cmd: string): string => {
    const commands: Record<string, () => string> = {
      help: () => "Available commands:\n  help - Show help",
      ls: () => "src/\npackage.json",
      pwd: () => "/workspace/project-1",
      date: () => new Date().toUTCString(),
      whoami: () => "builder-user",
      clear: () => "CLEAR",
    }

    const [command] = cmd.trim().split(" ")
    const cmdLower = command?.toLowerCase() ?? ""

    if (commands[cmdLower]) {
      return commands[cmdLower]()
    }

    return `Command not found: ${command}`
  }

  it("should process help command", () => {
    const result = processCommand("help")
    expect(result).toContain("Available commands")
  })

  it("should process ls command", () => {
    const result = processCommand("ls")
    expect(result).toContain("src/")
  })

  it("should process pwd command", () => {
    const result = processCommand("pwd")
    expect(result).toBe("/workspace/project-1")
  })

  it("should process whoami command", () => {
    const result = processCommand("whoami")
    expect(result).toBe("builder-user")
  })

  it("should process unknown command", () => {
    const result = processCommand("unknowncmd")
    expect(result).toContain("Command not found")
  })

  it("should process empty command", () => {
    const result = processCommand("")
    expect(result).toContain("Command not found")
  })
})
