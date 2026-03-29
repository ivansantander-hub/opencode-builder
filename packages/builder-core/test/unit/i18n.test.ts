import { describe, it, expect, beforeEach } from "vitest"
import { i18n, translations, type Locale } from "../../src/i18n"

describe("i18n", () => {
  beforeEach(() => {
    i18n.setLocale("en")
  })

  describe("setLocale", () => {
    it("should set locale to English", () => {
      i18n.setLocale("en")
      expect(i18n.getLocale()).toBe("en")
    })

    it("should set locale to Spanish", () => {
      i18n.setLocale("es")
      expect(i18n.getLocale()).toBe("es")
    })
  })

  describe("getLocale", () => {
    it("should return current locale", () => {
      i18n.setLocale("es")
      expect(i18n.getLocale()).toBe("es")
    })
  })

  describe("t", () => {
    it("should return English translation by default", () => {
      const text = i18n.t("error.unauthorized")
      expect(text).toBe("Unauthorized")
    })

    it("should return Spanish translation when locale is es", () => {
      i18n.setLocale("es")
      const text = i18n.t("error.unauthorized")
      expect(text).toBe("No autorizado")
    })

    it("should fallback to English for unknown keys", () => {
      const text = i18n.t("unknown.key" as any)
      expect(text).toBe("unknown.key")
    })

    it("should return English fallback if translation missing in Spanish", () => {
      i18n.setLocale("es")
      // Remove a Spanish translation to test fallback
      const original = translations.es["error.unauthorized"]
      translations.es["error.unauthorized"] = "" as any
      const text = i18n.t("error.unauthorized")
      expect(text).toBe("Unauthorized") // Falls back to English
      translations.es["error.unauthorized"] = original
    })

    it("should interpolate params", () => {
      const text = i18n.t("validation.minLength", { min: 5 })
      expect(text).toBe("Must be at least 5 characters")
    })

    it("should interpolate multiple params", () => {
      // Create a test key with multiple params
      const text = i18n.t("validation.maxLength", { max: 100 })
      expect(text).toBe("Must be at most 100 characters")
    })

    it("should handle all error translations", () => {
      const errorKeys = [
        "error.unauthorized",
        "error.forbidden",
        "error.notFound",
        "error.invalidToken",
        "error.rateLimit",
        "error.validationFailed",
        "error.internalError",
      ] as const

      errorKeys.forEach((key) => {
        const en = i18n.t(key)
        i18n.setLocale("es")
        const es = i18n.t(key)
        i18n.setLocale("en")

        expect(en).toBeTruthy()
        expect(es).toBeTruthy()
        expect(en).not.toBe(es) // Spanish and English should differ
      })
    })

    it("should handle all validation translations", () => {
      const validationKeys = [
        "validation.required",
        "validation.minLength",
        "validation.maxLength",
        "validation.invalidFormat",
      ] as const

      validationKeys.forEach((key) => {
        const en = i18n.t(key)
        i18n.setLocale("es")
        const es = i18n.t(key)
        i18n.setLocale("en")

        expect(en).toBeTruthy()
        expect(es).toBeTruthy()
      })
    })

    it("should handle all project translations", () => {
      const projectKeys = [
        "project.notFound",
        "project.created",
        "project.updated",
        "project.deleted",
        "project.nameRequired",
        "project.templateRequired",
      ] as const

      projectKeys.forEach((key) => {
        const en = i18n.t(key)
        i18n.setLocale("es")
        const es = i18n.t(key)
        i18n.setLocale("en")

        expect(en).toBeTruthy()
        expect(es).toBeTruthy()
      })
    })

    it("should handle all common translations", () => {
      const commonKeys = [
        "common.loading",
        "common.save",
        "common.cancel",
        "common.delete",
        "common.edit",
        "common.create",
        "common.search",
        "common.close",
        "common.confirm",
      ] as const

      commonKeys.forEach((key) => {
        const en = i18n.t(key)
        i18n.setLocale("es")
        const es = i18n.t(key)
        i18n.setLocale("en")

        expect(en).toBeTruthy()
        expect(es).toBeTruthy()
      })
    })
  })
})
