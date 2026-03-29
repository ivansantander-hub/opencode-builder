import { For, type Component } from "solid-js"
import { Card } from "../ui/card"
import { Button } from "../ui/button"
import { LanguageSwitcher } from "../ui/language-switcher"
import { useI18n } from "../../i18n"

interface Project {
  id: string
  name: string
  description?: string
  template: string
  status: string
  updated_at: string
}

export interface ProjectListProps {
  projects: Project[]
  onCreateClick: () => void
}

export const ProjectList: Component<ProjectListProps> = (props) => {
  const { t } = useI18n()

  return (
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-900">{t("projects.title")}</h1>
        <div class="flex items-center gap-4">
          <LanguageSwitcher />
          <Button onClick={props.onCreateClick}>{t("projects.new")}</Button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <For each={props.projects}>
          {(project) => (
            <Card>
              <h3 class="text-lg font-semibold text-gray-900">{project.name}</h3>
              {project.description && <p class="text-sm text-gray-600 mt-2">{project.description}</p>}
              <div class="flex items-center justify-between mt-4">
                <span class="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">{project.template}</span>
                <span class="text-xs text-gray-500">{project.status}</span>
              </div>
            </Card>
          )}
        </For>
      </div>

      {props.projects.length === 0 && (
        <Card>
          <div class="text-center py-8">
            <p class="text-gray-500">{t("projects.empty.message")}</p>
            <p class="text-sm text-gray-400 mt-2">{t("projects.empty.description")}</p>
          </div>
        </Card>
      )}
    </div>
  )
}
