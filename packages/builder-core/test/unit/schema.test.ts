import { describe, it, expect } from "vitest"
import * as schema from "../../src/schema/builder.sql"

describe("Schema Tables", () => {
  describe("Tables exist", () => {
    it("should export ProjectTable", () => {
      expect(schema.ProjectTable).toBeDefined()
    })

    it("should export SessionTable", () => {
      expect(schema.SessionTable).toBeDefined()
    })

    it("should export MessageTable", () => {
      expect(schema.MessageTable).toBeDefined()
    })

    it("should export DatabaseTable", () => {
      expect(schema.DatabaseTable).toBeDefined()
    })

    it("should export DeploymentTable", () => {
      expect(schema.DeploymentTable).toBeDefined()
    })

    it("should export RepositoryTable", () => {
      expect(schema.RepositoryTable).toBeDefined()
    })

    it("should export CommitTable", () => {
      expect(schema.CommitTable).toBeDefined()
    })
  })

  describe("Relations exist", () => {
    it("should export projectRelations", () => {
      expect(schema.projectRelations).toBeDefined()
    })

    it("should export sessionRelations", () => {
      expect(schema.sessionRelations).toBeDefined()
    })

    it("should export messageRelations", () => {
      expect(schema.messageRelations).toBeDefined()
    })

    it("should export databaseRelations", () => {
      expect(schema.databaseRelations).toBeDefined()
    })

    it("should export deploymentRelations", () => {
      expect(schema.deploymentRelations).toBeDefined()
    })

    it("should export repositoryRelations", () => {
      expect(schema.repositoryRelations).toBeDefined()
    })

    it("should export commitRelations", () => {
      expect(schema.commitRelations).toBeDefined()
    })
  })
})
