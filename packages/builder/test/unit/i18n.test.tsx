import { describe, it, expect } from "vitest"
import en from "../../src/i18n/en.json"
import es from "../../src/i18n/es.json"

const getNestedValue = (obj: Record<string, unknown>, path: string): unknown => {
  const keys = path.split(".")
  let result: unknown = obj
  for (const key of keys) {
    if (result && typeof result === "object" && key in result) {
      result = (result as Record<string, unknown>)[key]
    } else {
      return undefined
    }
  }
  return result
}

const flattenKeys = (obj: unknown, prefix = ""): string[] => {
  if (typeof obj !== "object" || obj === null) return []

  return Object.entries(obj).flatMap(([key, value]) => {
    const newPrefix = prefix ? `${prefix}.${key}` : key
    if (typeof value === "object" && value !== null && value !== undefined) {
      return flattenKeys(value, newPrefix)
    }
    if (typeof value === "string") {
      return [newPrefix]
    }
    return []
  })
}

describe("UI i18n translations", () => {
  it("should have all keys defined in both locales", () => {
    const enKeys = flattenKeys(en)
    const esKeys = flattenKeys(es)

    expect(enKeys).toEqual(esKeys)
  })

  it("should have non-empty translations for all keys", () => {
    const enKeys = flattenKeys(en)
    enKeys.forEach((key) => {
      const value = getNestedValue(en as unknown as Record<string, unknown>, key)
      expect(value).toBeTruthy()
      expect(typeof value).toBe("string")
    })
  })

  it("should have Spanish translations that differ from English", () => {
    const keysToCheck = ["app.description", "nav.dashboard", "projects.title", "auth.login", "error.network"]

    keysToCheck.forEach((key) => {
      const enValue = getNestedValue(en as unknown as Record<string, unknown>, key)
      const esValue = getNestedValue(es as unknown as Record<string, unknown>, key)
      expect(enValue).not.toBe(esValue)
    })
  })

  it("should have template translations", () => {
    const templateKeys = [
      "project.template.react",
      "project.template.svelte",
      "project.template.vue",
      "project.template.astro",
      "project.template.nextjs",
      "project.template.nuxt",
    ]

    templateKeys.forEach((key) => {
      const enValue = getNestedValue(en as unknown as Record<string, unknown>, key)
      const esValue = getNestedValue(es as unknown as Record<string, unknown>, key)
      expect(enValue).toBeDefined()
      expect(esValue).toBeDefined()
    })
  })
})
