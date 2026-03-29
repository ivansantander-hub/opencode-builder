import { z } from "zod"

export const ProjectSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  template: z.string(),
  owner_id: z.string(),
  status: z.enum(["active", "archived", "deleted"]).default("active"),
  created_at: z.date(),
  updated_at: z.date(),
  settings: z.record(z.unknown()).optional(),
})

export const CreateProjectSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  template: z.string(),
  settings: z.record(z.unknown()).optional(),
})

export const UpdateProjectSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  status: z.enum(["active", "archived", "deleted"]).optional(),
  settings: z.record(z.unknown()).optional(),
})

export type Project = z.infer<typeof ProjectSchema>
export type CreateProject = z.infer<typeof CreateProjectSchema>
export type UpdateProject = z.infer<typeof UpdateProjectSchema>
