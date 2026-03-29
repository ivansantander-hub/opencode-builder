export interface TranslationKeys {
  // Errors
  "error.unauthorized": string
  "error.forbidden": string
  "error.notFound": string
  "error.invalidToken": string
  "error.rateLimit": string
  "error.validationFailed": string
  "error.internalError": string

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
}

export type Locale = "en" | "es"

export const translations: Record<Locale, TranslationKeys> = {
  en: {
    // Errors
    "error.unauthorized": "Unauthorized",
    "error.forbidden": "Forbidden",
    "error.notFound": "Not found",
    "error.invalidToken": "Invalid token",
    "error.rateLimit": "Rate limit exceeded",
    "error.validationFailed": "Validation failed",
    "error.internalError": "Internal server error",

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
  },
}

export class I18n {
  private locale: Locale = "en"

  setLocale(locale: Locale): void {
    this.locale = locale
  }

  getLocale(): Locale {
    return this.locale
  }

  t(key: keyof TranslationKeys, params?: Record<string, string | number>): string {
    let text = translations[this.locale][key] || translations.en[key] || key

    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, String(v))
      })
    }

    return text
  }
}

export const i18n = new I18n()
