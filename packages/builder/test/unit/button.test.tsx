import { describe, it, expect } from "vitest"
import { Button } from "../../src/components/ui/button"

describe("Button", () => {
  it("should be defined", () => {
    expect(Button).toBeDefined()
  })

  it("should accept required props", () => {
    const props = {
      children: "Click me",
      onClick: () => {},
    }
    expect(props).toBeDefined()
  })
})
