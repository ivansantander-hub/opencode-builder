import { ulid } from "ulid"
import type { Project, CreateProject, UpdateProject } from "./types.js"
import type { StorageAdapter } from "../storage/index.js"

export class ProjectManager {
  constructor(private storage: StorageAdapter) {}

  async create(ownerId: string, data: CreateProject): Promise<Project> {
    const now = new Date()
    const project: Project = {
      id: ulid(),
      name: data.name,
      description: data.description,
      template: data.template,
      owner_id: ownerId,
      status: "active",
      created_at: now,
      updated_at: now,
      settings: data.settings,
    }

    await this.storage.execute(
      `INSERT INTO project (id, name, description, template, owner_id, status, created_at, updated_at, settings)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        project.id,
        project.name,
        project.description || null,
        project.template,
        project.owner_id,
        project.status,
        project.created_at.toISOString(),
        project.updated_at.toISOString(),
        project.settings ? JSON.stringify(project.settings) : null,
      ],
    )

    return project
  }

  async get(id: string): Promise<Project | null> {
    const result = await this.storage.query<Project>("SELECT * FROM project WHERE id = ?", [id])

    if (!result.rows.length) return null

    const row = result.rows[0]
    return this.parseRow(row)
  }

  async listByOwner(ownerId: string): Promise<Project[]> {
    const result = await this.storage.query<Project>(
      "SELECT * FROM project WHERE owner_id = ? AND status != ? ORDER BY updated_at DESC",
      [ownerId, "deleted"],
    )

    return result.rows.map((row) => this.parseRow(row))
  }

  async update(id: string, data: UpdateProject): Promise<Project | null> {
    const existing = await this.get(id)
    if (!existing) return null

    const updates: string[] = []
    const values: (string | null)[] = []

    if (data.name) {
      updates.push("name = ?")
      values.push(data.name)
    }
    if (data.description !== undefined) {
      updates.push("description = ?")
      values.push(data.description || null)
    }
    if (data.status) {
      updates.push("status = ?")
      values.push(data.status)
    }
    if (data.settings) {
      updates.push("settings = ?")
      values.push(JSON.stringify(data.settings))
    }

    updates.push("updated_at = ?")
    values.push(new Date().toISOString())
    values.push(id)

    await this.storage.execute(`UPDATE project SET ${updates.join(", ")} WHERE id = ?`, values)

    return this.get(id)
  }

  async delete(id: string): Promise<boolean> {
    await this.storage.execute("UPDATE project SET status = ?, updated_at = ? WHERE id = ?", [
      "deleted",
      new Date().toISOString(),
      id,
    ])
    return true
  }

  private parseRow(row: Record<string, unknown>): Project {
    return {
      id: String(row.id),
      name: String(row.name),
      description: row.description ? String(row.description) : undefined,
      template: String(row.template),
      owner_id: String(row.owner_id),
      status: row.status as "active" | "archived" | "deleted",
      created_at: new Date(String(row.created_at)),
      updated_at: new Date(String(row.updated_at)),
      settings: row.settings ? JSON.parse(String(row.settings)) : undefined,
    }
  }
}

export type { Project, CreateProject, UpdateProject } from "./types.js"
export { ProjectSchema, CreateProjectSchema, UpdateProjectSchema } from "./types.js"
