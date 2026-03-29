import { describe, it, expect } from "vitest"
import { ProjectSchema, CreateProjectSchema, UpdateProjectSchema } from "../../src/project/types"

describe("ProjectSchema", () => {
  it("should validate a valid project", () => {
    const project = {
      id: "proj-123",
      name: "Test Project",
      template: "react-vite",
      owner_id: "user-123",
      status: "active",
      created_at: new Date(),
      updated_at: new Date(),
    }

    const result = ProjectSchema.safeParse(project)
    expect(result.success).toBe(true)
  })

  it("should reject project without required fields", () => {
    const project = {
      id: "proj-123",
      name: "",
      template: "react-vite",
      owner_id: "user-123",
      status: "active",
      created_at: new Date(),
      updated_at: new Date(),
    }

    const result = ProjectSchema.safeParse(project)
    expect(result.success).toBe(false)
  })

  it("should reject project with name too long", () => {
    const project = {
      id: "proj-123",
      name: "a".repeat(101),
      template: "react-vite",
      owner_id: "user-123",
      status: "active",
      created_at: new Date(),
      updated_at: new Date(),
    }

    const result = ProjectSchema.safeParse(project)
    expect(result.success).toBe(false)
  })

  it("should validate optional description", () => {
    const project = {
      id: "proj-123",
      name: "Test Project",
      description: "A test project",
      template: "react-vite",
      owner_id: "user-123",
      status: "active",
      created_at: new Date(),
      updated_at: new Date(),
    }

    const result = ProjectSchema.safeParse(project)
    expect(result.success).toBe(true)
  })
})

describe("CreateProjectSchema", () => {
  it("should validate valid creation data", () => {
    const data = {
      name: "New Project",
      template: "react-vite",
    }

    const result = CreateProjectSchema.safeParse(data)
    expect(result.success).toBe(true)
  })

  it("should accept optional description", () => {
    const data = {
      name: "New Project",
      template: "react-vite",
      description: "Project description",
    }

    const result = CreateProjectSchema.safeParse(data)
    expect(result.success).toBe(true)
  })

  it("should reject without name", () => {
    const data = {
      template: "react-vite",
    }

    const result = CreateProjectSchema.safeParse(data)
    expect(result.success).toBe(false)
  })

  it("should reject without template", () => {
    const data = {
      name: "New Project",
    }

    const result = CreateProjectSchema.safeParse(data)
    expect(result.success).toBe(false)
  })
})

describe("UpdateProjectSchema", () => {
  it("should validate empty update", () => {
    const data = {}
    const result = UpdateProjectSchema.safeParse(data)
    expect(result.success).toBe(true)
  })

  it("should validate partial update", () => {
    const data = {
      name: "Updated Name",
    }

    const result = UpdateProjectSchema.safeParse(data)
    expect(result.success).toBe(true)
  })

  it("should validate status update", () => {
    const data = {
      status: "archived",
    }

    const result = UpdateProjectSchema.safeParse(data)
    expect(result.success).toBe(true)
  })

  it("should reject invalid status", () => {
    const data = {
      status: "invalid",
    }

    const result = UpdateProjectSchema.safeParse(data)
    expect(result.success).toBe(false)
  })
})
