import { createContext, useContext, createSignal, type ParentComponent, createMemo } from "solid-js"

export type Locale = "en" | "es"

// Extended translations for UI
export interface UITranslationKeys {
  // Errors
  "error.unauthorized": string
  "error.forbidden": string
  "error.notFound": string
  "error.invalidToken": string
  "error.rateLimit": string
  "error.validationFailed": string
  "error.internalError": string
  "error.network": string
  "error.unknown": string
  "error.retry": string

  // Validation
  "validation.required": string
  "validation.minLength": string
  "validation.maxLength": string
  "validation.invalidFormat": string

  // Projects
  "project.notFound": string
  "project.created": string
  "project.updated": string
  "project.deleted": string
  "project.nameRequired": string
  "project.templateRequired": string
  "project.create.title": string
  "project.name.label": string
  "project.name.placeholder": string
  "project.description.label": string
  "project.description.placeholder": string
  "project.template.label": string
  "project.template.react": string
  "project.template.svelte": string
  "project.template.vue": string
  "project.template.astro": string
  "project.template.nextjs": string
  "project.template.nuxt": string

  // Common
  "common.loading": string
  "common.save": string
  "common.cancel": string
  "common.delete": string
  "common.edit": string
  "common.create": string
  "common.search": string
  "common.close": string
  "common.confirm": string

  // App
  "app.title": string
  "app.description": string

  // Navigation
  "nav.dashboard": string
  "nav.projects": string
  "nav.settings": string
  "nav.logout": string

  // Projects UI
  "projects.title": string
  "projects.new": string
  "projects.empty": string
  "projects.empty.description": string
  "projects.search": string
  "projects.filter": string

  // Auth
  "auth.login": string
  "auth.logout": string
  "auth.welcome": string
}

const uiTranslations: Record<Locale, UITranslationKeys> = {
  en: {
    // Errors
    "error.unauthorized": "Unauthorized",
    "error.forbidden": "Forbidden",
    "error.notFound": "Not found",
    "error.invalidToken": "Invalid token",
    "error.rateLimit": "Rate limit exceeded",
    "error.validationFailed": "Validation failed",
    "error.internalError": "Internal server error",
    "error.network": "Network error. Please check your connection.",
    "error.unknown": "An unexpected error occurred",
    "error.retry": "Retry",

    // Validation
    "validation.required": "This field is required",
    "validation.minLength": "Must be at least {min} characters",
    "validation.maxLength": "Must be at most {max} characters",
    "validation.invalidFormat": "Invalid format",

    // Projects
    "project.notFound": "Project not found",
    "project.created": "Project created successfully",
    "project.updated": "Project updated successfully",
    "project.deleted": "Project deleted successfully",
    "project.nameRequired": "Project name is required",
    "project.templateRequired": "Template is required",
    "project.create.title": "Create New Project",
    "project.name.label": "Name",
    "project.name.placeholder": "My Awesome Project",
    "project.description.label": "Description",
    "project.description.placeholder": "Brief description of your project",
    "project.template.label": "Template",
    "project.template.react": "React + Vite",
    "project.template.svelte": "Svelte + Vite",
    "project.template.vue": "Vue + Vite",
    "project.template.astro": "Astro",
    "project.template.nextjs": "Next.js",
    "project.template.nuxt": "Nuxt",

    // Common
    "common.loading": "Loading...",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.delete": "Delete",
    "common.edit": "Edit",
    "common.create": "Create",
    "common.search": "Search",
    "common.close": "Close",
    "common.confirm": "Confirm",

    // App
    "app.title": "OpenCode Builder",
    "app.description": "Build web projects with AI",

    // Navigation
    "nav.dashboard": "Dashboard",
    "nav.projects": "Projects",
    "nav.settings": "Settings",
    "nav.logout": "Logout",

    // Projects UI
    "projects.title": "Projects",
    "projects.new": "New Project",
    "projects.empty": "No projects yet",
    "projects.empty.description": "Create your first project to get started",
    "projects.search": "Search projects...",
    "projects.filter": "Filter",

    // Auth
    "auth.login": "Login",
    "auth.logout": "Logout",
    "auth.welcome": "Welcome",
  },
  es: {
    // Errors
    "error.unauthorized": "No autorizado",
    "error.forbidden": "Acceso prohibido",
    "error.notFound": "No encontrado",
    "error.invalidToken": "Token inválido",
    "error.rateLimit": "Límite de peticiones excedido",
    "error.validationFailed": "Validación fallida",
    "error.internalError": "Error interno del servidor",
    "error.network": "Error de red. Por favor verifica tu conexión.",
    "error.unknown": "Ocurrió un error inesperado",
    "error.retry": "Reintentar",

    // Validation
    "validation.required": "Este campo es obligatorio",
    "validation.minLength": "Debe tener al menos {min} caracteres",
    "validation.maxLength": "Debe tener como máximo {max} caracteres",
    "validation.invalidFormat": "Formato inválido",

    // Projects
    "project.notFound": "Proyecto no encontrado",
    "project.created": "Proyecto creado exitosamente",
    "project.updated": "Proyecto actualizado exitosamente",
    "project.deleted": "Proyecto eliminado exitosamente",
    "project.nameRequired": "El nombre del proyecto es obligatorio",
    "project.templateRequired": "La plantilla es obligatoria",
    "project.create.title": "Crear Nuevo Proyecto",
    "project.name.label": "Nombre",
    "project.name.placeholder": "Mi Proyecto Increíble",
    "project.description.label": "Descripción",
    "project.description.placeholder": "Breve descripción de tu proyecto",
    "project.template.label": "Plantilla",
    "project.template.react": "React + Vite",
    "project.template.svelte": "Svelte + Vite",
    "project.template.vue": "Vue + Vite",
    "project.template.astro": "Astro",
    "project.template.nextjs": "Next.js",
    "project.template.nuxt": "Nuxt",

    // Common
    "common.loading": "Cargando...",
    "common.save": "Guardar",
    "common.cancel": "Cancelar",
    "common.delete": "Eliminar",
    "common.edit": "Editar",
    "common.create": "Crear",
    "common.search": "Buscar",
    "common.close": "Cerrar",
    "common.confirm": "Confirmar",

    // App
    "app.title": "OpenCode Builder",
    "app.description": "Construye proyectos web con IA",

    // Navigation
    "nav.dashboard": "Panel",
    "nav.projects": "Proyectos",
    "nav.settings": "Configuración",
    "nav.logout": "Cerrar sesión",

    // Projects UI
    "projects.title": "Proyectos",
    "projects.new": "Nuevo Proyecto",
    "projects.empty": "No hay proyectos aún",
    "projects.empty.description": "Crea tu primer proyecto para comenzar",
    "projects.search": "Buscar proyectos...",
    "projects.filter": "Filtrar",

    // Auth
    "auth.login": "Iniciar sesión",
    "auth.logout": "Cerrar sesión",
    "auth.welcome": "Bienvenido",
  },
}

export type { Locale }
export { uiTranslations }

interface I18nContextValue {
  locale: () => Locale
  setLocale: (locale: Locale) => void
  t: (key: keyof UITranslationKeys, params?: Record<string, string | number>) => string
}

const I18nContext = createContext<I18nContextValue>()

export const I18nProvider: ParentComponent = (props) => {
  const [locale, setLocaleState] = createSignal<Locale>("en")

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem("builder-locale", newLocale)
  }

  const t = createMemo(() => {
    return (key: keyof UITranslationKeys, params?: Record<string, string | number>) => {
      const currentLocale = locale()
      let text = uiTranslations[currentLocale][key]
      if (!text) {
        text = uiTranslations.en[key]
      }
      if (!text) {
        text = key
      }

      if (params) {
        Object.entries(params).forEach(([k, v]) => {
          text = text.replace(`{${k}}`, String(v))
        })
      }

      return text
    }
  })

  return (
    <I18nContext.Provider
      value={{
        locale,
        setLocale,
        t: (key, params?) => t()(key, params),
      }}
    >
      {props.children}
    </I18nContext.Provider>
  )
}

export const useI18n = () => {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error("useI18n must be used within I18nProvider")
  return ctx
}
