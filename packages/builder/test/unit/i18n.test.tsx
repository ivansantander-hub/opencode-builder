import { describe, it, expect } from "vitest"
import { uiTranslations } from "../../src/i18n"

describe("UI i18n translations", () => {
  it("should have all keys defined in both locales", () => {
    const enKeys = Object.keys(uiTranslations.en)
    const esKeys = Object.keys(uiTranslations.es)

    expect(enKeys).toEqual(esKeys)
  })

  it("should have non-empty translations for all keys", () => {
    Object.entries(uiTranslations.en).forEach(([key, value]) => {
      expect(value).toBeTruthy()
      expect(typeof value).toBe("string")
    })

    Object.entries(uiTranslations.es).forEach(([key, value]) => {
      expect(value).toBeTruthy()
      expect(typeof value).toBe("string")
    })
  })

  it("should have Spanish translations that differ from English", () => {
    const keysToCheck = ["app.description", "nav.dashboard", "projects.title", "auth.login", "error.network"]

    keysToCheck.forEach((key) => {
      const en = uiTranslations.en[key as keyof typeof uiTranslations.en]
      const es = uiTranslations.es[key as keyof typeof uiTranslations.es]
      expect(en).not.toBe(es)
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
      expect(uiTranslations.en[key as keyof typeof uiTranslations.en]).toBeDefined()
      expect(uiTranslations.es[key as keyof typeof uiTranslations.es]).toBeDefined()
    })
  })
})
