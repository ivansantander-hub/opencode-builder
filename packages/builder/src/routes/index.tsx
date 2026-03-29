import { createSignal, Show, type Component } from "solid-js"
import { useAuth } from "../contexts/auth"
import { ProjectList } from "../components/project/project-list"
import { CreateProjectForm } from "../components/project/create-project-form"

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
  const [showCreateForm, setShowCreateForm] = createSignal(false)
  const [projects, setProjects] = createSignal<Project[]>([])

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
        const result = await response.json()
        setProjects((prev) => [...prev, result.project])
        setShowCreateForm(false)
      }
    } catch (err) {
      console.error("Failed to create project:", err)
    }
  }

  return (
    <div class="container mx-auto px-4 py-8">
      <Show
        when={showCreateForm()}
        fallback={<ProjectList projects={projects()} onCreateClick={() => setShowCreateForm(true)} />}
      >
        <CreateProjectForm onSubmit={handleCreateProject} onCancel={() => setShowCreateForm(false)} />
      </Show>
    </div>
  )
}

export default Dashboard
