import { createSignal, Show, type Component } from "solid-js"
import { useAuth } from "../contexts/auth"
import { ProjectList } from "../components/project/project-list"
import { CreateProjectForm } from "../components/project/create-project-form"
import { LoginForm } from "../components/auth/login-form"
import { RegisterForm } from "../components/auth/register-form"
import { Button } from "../components/ui/button"
import { useI18n } from "../i18n"

interface Project {
  id: string
  name: string
  description?: string
  template: string
  status: string
  updated_at: string
}

const Dashboard: Component = () => {
  const auth = useAuth()
  const { t } = useI18n()
  const [showCreateForm, setShowCreateForm] = createSignal(false)
  const [projects, setProjects] = createSignal<Project[]>([])
  const [showRegister, setShowRegister] = createSignal(false)

  const handleCreateProject = async (data: { name: string; description?: string; template: string }) => {
    const token = auth.token()
    if (!token) return

    try {
      const response = await fetch("/api/builder/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        const result = (await response.json()) as { project: Project }
        setProjects((prev) => [...prev, result.project])
        setShowCreateForm(false)
      }
    } catch (err) {
      console.error("Failed to create project:", err)
    }
  }

  const handleLogout = () => {
    auth.logout()
  }

  return (
    <Show
      when={auth.isAuthenticated()}
      fallback={
        <Show when={showRegister()} fallback={<LoginForm onSwitchToRegister={() => setShowRegister(true)} />}>
          <RegisterForm onSwitchToLogin={() => setShowRegister(false)} />
        </Show>
      }
    >
      <div>
        <div class="flex justify-between items-center p-4 bg-white shadow">
          <h1 class="text-xl font-bold">{t("app.title")}</h1>
          <div class="flex items-center gap-4">
            <span class="text-sm text-gray-600">{auth.user()?.email}</span>
            <Button onClick={handleLogout} variant="secondary">
              {t("auth.logout")}
            </Button>
          </div>
        </div>
        <div class="container mx-auto px-4 py-8">
          <Show
            when={showCreateForm()}
            fallback={<ProjectList projects={projects()} onCreateClick={() => setShowCreateForm(true)} />}
          >
            <CreateProjectForm onSubmit={handleCreateProject} onCancel={() => setShowCreateForm(false)} />
          </Show>
        </div>
      </div>
    </Show>
  )
}

export default Dashboard
