import { createContext, useContext, createSignal, type ParentComponent } from "solid-js"
import en from "./en.json"
import es from "./es.json"

export type Locale = "en" | "es"

type NestedKeyOf<T> = T extends object
  ? { [K in keyof T]: K extends string ? (T[K] extends object ? `${K}.${NestedKeyOf<T[K]>}` : K) : never }[keyof T]
  : never

export type TranslationKey = NestedKeyOf<typeof en>

const translations: Record<Locale, typeof en> = { en, es }

interface I18nContextValue {
  locale: () => Locale
  setLocale: (locale: Locale) => void
  t: (key: string, params?: Record<string, string | number>) => string
}

const I18nContext = createContext<I18nContextValue>()

const getNestedValue = (obj: Record<string, unknown>, path: string): string | undefined => {
  const keys = path.split(".")
  let result: unknown = obj
  for (const key of keys) {
    if (result && typeof result === "object" && key in result) {
      result = (result as Record<string, unknown>)[key]
    } else {
      return undefined
    }
  }
  return typeof result === "string" ? result : undefined
}

export const I18nProvider: ParentComponent = (props) => {
  const savedLocale = (
    typeof localStorage !== "undefined" ? localStorage.getItem("builder-locale") : null
  ) as Locale | null
  const [locale, setLocaleState] = createSignal<Locale>(savedLocale || "en")

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("builder-locale", newLocale)
    }
  }

  const t = (key: string, params?: Record<string, string | number>): string => {
    const currentLocale = locale()
    let text = getNestedValue(translations[currentLocale] as unknown as Record<string, unknown>, key)

    if (!text) {
      text = getNestedValue(translations.en as unknown as Record<string, unknown>, key)
    }

    if (!text) {
      return key
    }

    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text!.replace(`{${k}}`, String(v))
      })
    }

    return text
  }

  return <I18nContext.Provider value={{ locale, setLocale, t }}>{props.children}</I18nContext.Provider>
}

export const useI18n = () => {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error("useI18n must be used within I18nProvider")
  return ctx
}

export const localeNames: Record<Locale, string> = {
  en: "English",
  es: "Español",
}
