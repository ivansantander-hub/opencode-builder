import { createSignal, type Component } from "solid-js"
import { Card } from "../ui/card"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { useI18n } from "../../i18n"

export interface CreateProjectFormProps {
  onSubmit: (data: { name: string; description?: string; template: string }) => void
  onCancel: () => void
}

export const CreateProjectForm: Component<CreateProjectFormProps> = (props) => {
  const { t } = useI18n()
  const [name, setName] = createSignal("")
  const [description, setDescription] = createSignal("")
  const [template, setTemplate] = createSignal("react-vite")

  const templates = [
    { value: "react-vite", label: t("project.template.react") },
    { value: "svelte-vite", label: t("project.template.svelte") },
    { value: "vue-vite", label: t("project.template.vue") },
    { value: "astro", label: t("project.template.astro") },
    { value: "nextjs", label: t("project.template.nextjs") },
    { value: "nuxt", label: t("project.template.nuxt") },
  ]

  const handleSubmit = (e: Event) => {
    e.preventDefault()
    props.onSubmit({
      name: name(),
      description: description() || undefined,
      template: template(),
    })
  }

  return (
    <Card>
      <h2 class="text-xl font-semibold text-gray-900 mb-4">{t("project.create.title")}</h2>
      <form onSubmit={handleSubmit} class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">{t("project.name.label")}</label>
          <Input value={name()} onChange={setName} placeholder={t("project.name.placeholder")} />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">{t("project.description.label")}</label>
          <Input value={description()} onChange={setDescription} placeholder={t("project.description.placeholder")} />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">{t("project.template.label")}</label>
          <select class="input" value={template()} onChange={(e) => setTemplate(e.currentTarget.value)}>
            {templates.map((t) => (
              <option value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        <div class="flex gap-3 pt-4">
          <Button type="submit">{t("common.create")}</Button>
          <Button variant="secondary" onClick={props.onCancel}>
            {t("common.cancel")}
          </Button>
        </div>
      </form>
    </Card>
  )
}
