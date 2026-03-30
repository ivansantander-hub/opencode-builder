export interface TerminalMessage {
  type: "input" | "output" | "resize" | "error"
  data?: string
  cols?: number
  rows?: number
}

export class TerminalDurableObject {
  state: DurableObjectState
  webSocket: WebSocket | null = null
  sessionId: string

  constructor(state: DurableObjectState, _env: Record<string, unknown>) {
    this.state = state
    this.sessionId = `session-${Date.now()}`
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url)

    if (url.pathname === "/ws") {
      return this.handleWebSocket(request)
    }

    if (url.pathname === "/session") {
      return new Response(JSON.stringify({ sessionId: this.sessionId }), {
        headers: { "Content-Type": "application/json" },
      })
    }

    return new Response("Not Found", { status: 404 })
  }

  private async handleWebSocket(_request: Request): Promise<Response> {
    const { 0: client, 1: server } = new WebSocketPair()

    this.webSocket = server

    server.accept()

    server.addEventListener("message", (event) => {
      this.handleMessage(event.data as string)
    })

    server.addEventListener("close", () => {
      this.handleClose()
    })

    server.addEventListener("error", () => {
      console.error("WebSocket error")
      this.sendOutput("Error de conexión con el terminal\r\n")
    })

    this.sendOutput(`OpenCode Builder Terminal\r\n`)
    this.sendOutput(`Session: ${this.sessionId}\r\n`)
    this.sendOutput(`-------------------------------\r\n`)
    this.sendOutput(`$ `)

    return new Response(null, { status: 101, webSocket: client })
  }

  private handleMessage(data: string): void {
    try {
      const message: TerminalMessage = JSON.parse(data)

      switch (message.type) {
        case "input":
          this.handleInput(message.data || "")
          break
        case "resize":
          this.handleResize(message.cols || 80, message.rows || 24)
          break
        default:
          console.log("Unknown message type:", message.type)
      }
    } catch (e) {
      console.error("Failed to parse message:", e)
    }
  }

  private handleInput(input: string): void {
    const trimmed = input.trim()

    if (!trimmed) {
      this.sendOutput("$ ")
      return
    }

    const response = this.processCommand(trimmed)
    this.sendOutput(response)
  }

  private processCommand(cmd: string): string {
    const commands: Record<string, (args?: string) => string> = {
      help: () => {
        return `Available commands:
  help     - Show this help
  ls       - List files (simulated)
  pwd      - Print working directory
  echo     - Echo text
  date     - Show current date
  clear    - Clear terminal
  whoami   - Show current user
  env      - Show environment
--------------------------
Type 'clear' to clear the screen
`
      },
      ls: () => {
        return `src/
package.json
tsconfig.json
vite.config.ts
index.html
README.md
`
      },
      pwd: () => {
        return `/workspace/project-1\r\n`
      },
      date: () => {
        return `${new Date().toUTCString()}\r\n`
      },
      whoami: () => {
        return `builder-user\r\n`
      },
      env: () => {
        return `NODE_ENV=development
PROJECT_ID=project-1
USER_ID=user-1
TERM=xterm-256color
`
      },
      clear: () => {
        return "CLEAR"
      },
      echo: (args?: string) => {
        return `${args || ""}\r\n`
      },
    }

    const [command, ...args] = cmd.split(" ")
    const cmdLower = command?.toLowerCase() ?? ""

    if (cmdLower === "echo") {
      return commands.echo!(args.join(" "))
    }

    if (cmdLower && commands[cmdLower]) {
      return commands[cmdLower]!()
    }

    return `Command not found: ${command}\r\nType 'help' for available commands\r\n`
  }

  private handleResize(cols: number, rows: number): void {
    console.log(`Terminal resized to ${cols}x${rows}`)
  }

  private handleClose(): void {
    console.log("WebSocket closed")
    this.webSocket = null
  }

  private sendOutput(text: string): void {
    if (this.webSocket && this.webSocket.readyState === WebSocket.OPEN) {
      const message: TerminalMessage = { type: "output", data: text }
      this.webSocket.send(JSON.stringify(message))
    }
  }
}
