export interface Project {
  id: string
  name: string
  description?: string
  template: string
  owner_id: string
  status: "active" | "archived" | "deleted"
  created_at: Date
  updated_at: Date
  settings?: Record<string, unknown>
}

export interface CreateProject {
  name: string
  description?: string
  template: string
  settings?: Record<string, unknown>
}

export interface UpdateProject {
  name?: string
  description?: string
  status?: "active" | "archived" | "deleted"
  settings?: Record<string, unknown>
}
