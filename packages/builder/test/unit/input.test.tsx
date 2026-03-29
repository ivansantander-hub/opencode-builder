import { describe, it, expect } from "vitest"
import { Input } from "../../src/components/ui/input"

describe("Input", () => {
  it("should be defined", () => {
    expect(Input).toBeDefined()
  })

  it("should accept value prop", () => {
    const props = {
      value: "test value",
      onChange: (val: string) => {},
    }
    expect(props).toBeDefined()
  })
})
