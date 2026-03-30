import { type Component } from "solid-js"
import { Terminal } from "../components/terminal/terminal"

const DemoTerminal: Component = () => {
  return (
    <div class="h-screen flex flex-col">
      <div class="bg-gray-900 text-white px-4 py-2 border-b border-gray-700">
        <h1 class="text-lg font-bold">OpenCode Builder - Terminal Demo</h1>
      </div>
      <div class="flex-1">
        <Terminal projectId="demo" />
      </div>
    </div>
  )
}

export default DemoTerminal
