import { type Component, For } from "solid-js"
import { useI18n, localeNames, type Locale } from "../../i18n"

export const LanguageSwitcher: Component = () => {
  const { locale, setLocale } = useI18n()
  const locales: Locale[] = ["en", "es"]

  return (
    <div class="flex items-center gap-2">
      <For each={locales}>
        {(loc) => (
          <button
            type="button"
            class={`px-3 py-1 text-sm rounded transition-colors ${
              locale() === loc ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setLocale(loc)}
          >
            {localeNames[loc]}
          </button>
        )}
      </For>
    </div>
  )
}
