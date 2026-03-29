import { describe, it, expect, beforeEach } from "vitest"
import { ProjectManager } from "../../src/project"
import { MemoryAdapter } from "../../src/storage/memory-adapter"

describe("ProjectManager", () => {
  let manager: ProjectManager
  let adapter: MemoryAdapter

  beforeEach(() => {
    adapter = new MemoryAdapter()
    manager = new ProjectManager(adapter)
  })

  describe("create", () => {
    it("should create a project with valid data", async () => {
      const project = await manager.create("user-123", {
        name: "Test Project",
        template: "react-vite",
      })

      expect(project).toBeDefined()
      expect(project.id).toBeDefined()
      expect(project.name).toBe("Test Project")
      expect(project.template).toBe("react-vite")
      expect(project.owner_id).toBe("user-123")
      expect(project.status).toBe("active")
    })

    it("should create project with description", async () => {
      const project = await manager.create("user-123", {
        name: "Test Project",
        template: "react-vite",
        description: "A test project",
      })

      expect(project.description).toBe("A test project")
    })

    it("should set timestamps on creation", async () => {
      const before = new Date()
      const project = await manager.create("user-123", {
        name: "Test Project",
        template: "react-vite",
      })
      const after = new Date()

      expect(project.created_at.getTime()).toBeGreaterThanOrEqual(before.getTime())
      expect(project.created_at.getTime()).toBeLessThanOrEqual(after.getTime())
      expect(project.updated_at.getTime()).toEqual(project.created_at.getTime())
    })
  })

  describe("get", () => {
    it("should return existing project", async () => {
      const created = await manager.create("user-123", {
        name: "Test Project",
        template: "react-vite",
      })

      const fetched = await manager.get(created.id)
      expect(fetched).toBeDefined()
      expect(fetched?.id).toBe(created.id)
      expect(fetched?.name).toBe("Test Project")
    })

    it("should return null for non-existent project", async () => {
      const project = await manager.get("non-existent-id")
      expect(project).toBeNull()
    })
  })

  describe("listByOwner", () => {
    it("should return empty array for new owner", async () => {
      const projects = await manager.listByOwner("new-owner")
      expect(projects).toEqual([])
    })

    it("should return projects for owner", async () => {
      await manager.create("owner-1", { name: "Project 1", template: "react-vite" })
      await manager.create("owner-1", { name: "Project 2", template: "svelte-vite" })
      await manager.create("owner-2", { name: "Project 3", template: "vue-vite" })

      const projects = await manager.listByOwner("owner-1")
      expect(projects).toHaveLength(2)
      expect(projects.map((p) => p.name)).toContain("Project 1")
      expect(projects.map((p) => p.name)).toContain("Project 2")
    })

    it("should exclude deleted projects", async () => {
      const project = await manager.create("owner-1", {
        name: "To Delete",
        template: "react-vite",
      })
      await manager.delete(project.id)

      const projects = await manager.listByOwner("owner-1")
      expect(projects).toHaveLength(0)
    })
  })

  describe("update", () => {
    it("should update project name", async () => {
      const created = await manager.create("user-123", {
        name: "Original Name",
        template: "react-vite",
      })

      const updated = await manager.update(created.id, { name: "New Name" })
      expect(updated?.name).toBe("New Name")
    })

    it("should update project status", async () => {
      const created = await manager.create("user-123", {
        name: "Test Project",
        template: "react-vite",
      })

      const updated = await manager.update(created.id, { status: "archived" })
      expect(updated?.status).toBe("archived")
    })

    it("should return null for non-existent project", async () => {
      const updated = await manager.update("non-existent", { name: "New Name" })
      expect(updated).toBeNull()
    })

    it("should update timestamp", async () => {
      const created = await manager.create("user-123", {
        name: "Test Project",
        template: "react-vite",
      })

      await new Promise((r) => setTimeout(r, 10))
      const updated = await manager.update(created.id, { name: "New Name" })

      expect(updated?.updated_at.getTime()).toBeGreaterThan(created.updated_at.getTime())
    })
  })

  describe("delete", () => {
    it("should soft delete project", async () => {
      const created = await manager.create("user-123", {
        name: "To Delete",
        template: "react-vite",
      })

      const result = await manager.delete(created.id)
      expect(result).toBe(true)

      const fetched = await manager.get(created.id)
      expect(fetched?.status).toBe("deleted")
    })

    it("should return true for non-existent project", async () => {
      const result = await manager.delete("non-existent")
      expect(result).toBe(true)
    })
  })
})
