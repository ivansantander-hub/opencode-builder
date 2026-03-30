import { onMount, onCleanup, type Component } from "solid-js"
import { Terminal as XTerm } from "xterm"
import { FitAddon } from "xterm-addon-fit"
import "xterm/css/xterm.css"

interface TerminalProps {
  projectId?: string
}

export const Terminal: Component<TerminalProps> = (props) => {
  let terminalRef: HTMLDivElement | undefined
  let xterm: XTerm | undefined
  let fitAddon: FitAddon | undefined

  let connected = true

  const processCommand = (cmd: string): string => {
    const commands: Record<string, () => string> = {
      help: () => `Available commands:
  help     - Show this help
  opencode - OpenCode Builder Info
  ls       - List files  
  pwd      - Print working directory
  echo     - Echo text
  date     - Show current date
  clear    - Clear terminal
  whoami   - Show current user
  env      - Show environment
  cat      - Show file content
  mkdir    - Create directory
  rm       - Remove file/directory
  touch    - Create file
--------------------------`,
      opencode: () => `╔════════════════════════════════════════════════════════╗
║              🚀 OpenCode Builder v1.0.0                 ║
╠════════════════════════════════════════════════════════╣
║  Web-based development platform built with:            ║
║  • SolidJS + Tailwind CSS v4 (Frontend)                 ║
║  • Cloudflare Workers + D1 (Backend)                   ║
║  • WebSocket Terminal (xterm.js)                        ║
║                                                        ║
║  Features:                                             ║
║  ✓ Project Management                                  ║
║  ✓ Code Editor                                          ║
║  ✓ Terminal Integration                                 ║
║  ✓ AI Chat                                              ║
║  ✓ Deployment                                           ║
╚════════════════════════════════════════════════════════╝`,
      ls: () => `src/
package.json
tsconfig.json
vite.config.ts
index.html
README.md`,
      pwd: () => `/workspace/${props.projectId || "project-1"}`,
      date: () => new Date().toUTCString(),
      whoami: () => "builder-user",
      env: () => `NODE_ENV=development
PROJECT_ID=${props.projectId || "project-1"}
USER_ID=user-1
TERM=xterm-256color`,
      clear: () => "CLEAR",
      cat: () => "Usage: cat <filename>\nExample: cat package.json",
      mkdir: () => "Usage: mkdir <dirname>\nExample: mkdir src/components",
      rm: () => "Usage: rm <filename>\nExample: rm file.txt",
      touch: () => "Usage: touch <filename>\nExample: touch app.ts",
    }

    const [command, ...args] = cmd.trim().split(" ")
    const cmdLower = command?.toLowerCase() ?? ""

    if (cmdLower === "echo") {
      return args.join(" ") || ""
    }

    if (commands[cmdLower]) {
      return commands[cmdLower]()
    }

    return `Command not found: ${command}\r\nType 'help' for available commands`
  }

  onMount(() => {
    if (!terminalRef) return

    xterm = new XTerm({
      cursorBlink: true,
      fontSize: 14,
      fontFamily: "Menlo, Monaco, 'Courier New', monospace",
      theme: {
        background: "#1e1e1e",
        foreground: "#d4d4d4",
        cursor: "#ffffff",
      },
    })

    fitAddon = new FitAddon()
    xterm.loadAddon(fitAddon)

    xterm.open(terminalRef)
    fitAddon.fit()

    xterm.writeln("\x1b[36m╔════════════════════════════════════════════════════════╗\x1b[0m")
    xterm.writeln(
      "\x1b[36m║\x1b[0m         \x1b[1;32mOpenCode Builder Terminal\x1b[0m                      \x1b[36m║\x1b[0m",
    )
    xterm.writeln("\x1b[36m║\x1b[0m                                                    \x1b[36m║\x1b[0m")
    xterm.writeln("\x1b[36m║\x1b[0m  Welcome to OpenCode Builder!                  \x1b[36m║\x1b[0m")
    xterm.writeln("\x1b[36m║\x1b[0m  Type 'help' to see available commands          \x1b[36m║\x1b[0m")
    xterm.writeln("\x1b[36m╚════════════════════════════════════════════════════════╝\x1b[0m")
    xterm.writeln("")
    xterm.write("\x1b[32m$\x1b[0m ")

    let currentLine = ""

    xterm.onData((data) => {
      if (data === "\r") {
        xterm!.write("\r\n")
        const response = processCommand(currentLine)
        if (response === "CLEAR") {
          xterm!.clear()
        } else if (response) {
          xterm!.writeln(response)
        }
        currentLine = ""
        xterm!.write("\x1b[32m$\x1b[0m ")
      } else if (data === "\u007f") {
        if (currentLine.length > 0) {
          currentLine = currentLine.slice(0, -1)
          xterm!.write("\b \b")
        }
      } else if (data >= " " && data <= "~") {
        currentLine += data
        xterm!.write(data)
      }
    })

    const handleResize = () => {
      fitAddon?.fit()
    }

    window.addEventListener("resize", handleResize)

    onCleanup(() => {
      window.removeEventListener("resize", handleResize)
      xterm?.dispose()
    })
  })

  return (
    <div class="flex flex-col h-full">
      <div class="flex items-center justify-between px-4 py-2 bg-gray-800 text-white">
        <span class="text-sm font-medium">Terminal</span>
        <div class="flex items-center gap-2">
          <span class={`w-2 h-2 rounded-full ${connected ? "bg-green-500" : "bg-red-500"}`} />
          <span class="text-xs text-gray-400">{connected ? "Connected" : "Disconnected"}</span>
        </div>
      </div>
      <div ref={terminalRef} class="flex-1 bg-[#1e1e1e] p-2" />
    </div>
  )
}
