import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core"
import { relations } from "drizzle-orm"

export const ProjectTable = sqliteTable(
  "project",
  {
    id: text().primaryKey(),
    name: text().notNull(),
    description: text(),
    template: text().notNull(),
    owner_id: text().notNull(),
    status: text().notNull().default("active"),
    created_at: integer({ mode: "timestamp" }).notNull(),
    updated_at: integer({ mode: "timestamp" }).notNull(),
    settings: text(),
  },
  (table) => ({
    owner_idx: index("project_owner_idx").on(table.owner_id),
    template_idx: index("project_template_idx").on(table.template),
  }),
)

export const SessionTable = sqliteTable(
  "session",
  {
    id: text().primaryKey(),
    project_id: text().notNull(),
    name: text().notNull(),
    created_at: integer({ mode: "timestamp" }).notNull(),
    updated_at: integer({ mode: "timestamp" }).notNull(),
    is_archived: integer({ mode: "boolean" }).notNull().default(false),
  },
  (table) => ({
    project_idx: index("session_project_idx").on(table.project_id),
  }),
)

export const MessageTable = sqliteTable(
  "message",
  {
    id: text().primaryKey(),
    session_id: text().notNull(),
    role: text().notNull(),
    content: text().notNull(),
    created_at: integer({ mode: "timestamp" }).notNull(),
    metadata: text(),
  },
  (table) => ({
    session_idx: index("message_session_idx").on(table.session_id),
  }),
)

export const DatabaseTable = sqliteTable(
  "database",
  {
    id: text().primaryKey(),
    project_id: text().notNull(),
    name: text().notNull(),
    type: text().notNull(),
    connection_string: text(),
    created_at: integer({ mode: "timestamp" }).notNull(),
    updated_at: integer({ mode: "timestamp" }).notNull(),
    status: text().notNull().default("active"),
  },
  (table) => ({
    project_idx: index("database_project_idx").on(table.project_id),
  }),
)

export const DeploymentTable = sqliteTable(
  "deployment",
  {
    id: text().primaryKey(),
    project_id: text().notNull(),
    type: text().notNull(),
    status: text().notNull(),
    url: text(),
    created_at: integer({ mode: "timestamp" }).notNull(),
    updated_at: integer({ mode: "timestamp" }).notNull(),
    metadata: text(),
  },
  (table) => ({
    project_idx: index("deployment_project_idx").on(table.project_id),
  }),
)

export const RepositoryTable = sqliteTable(
  "repository",
  {
    id: text().primaryKey(),
    project_id: text().notNull(),
    provider: text().notNull(),
    owner: text().notNull(),
    name: text().notNull(),
    url: text().notNull(),
    created_at: integer({ mode: "timestamp" }).notNull(),
    updated_at: integer({ mode: "timestamp" }).notNull(),
    is_private: integer({ mode: "boolean" }).notNull().default(true),
  },
  (table) => ({
    project_idx: index("repository_project_idx").on(table.project_id),
  }),
)

export const CommitTable = sqliteTable(
  "commit",
  {
    id: text().primaryKey(),
    repository_id: text().notNull(),
    sha: text().notNull(),
    message: text().notNull(),
    author: text().notNull(),
    created_at: integer({ mode: "timestamp" }).notNull(),
    url: text(),
  },
  (table) => ({
    repository_idx: index("commit_repository_idx").on(table.repository_id),
  }),
)

export const projectRelations = relations(ProjectTable, ({ many }) => ({
  sessions: many(SessionTable),
  databases: many(DatabaseTable),
  deployments: many(DeploymentTable),
  repositories: many(RepositoryTable),
}))

export const sessionRelations = relations(SessionTable, ({ one, many }) => ({
  project: one(ProjectTable, {
    fields: [SessionTable.project_id],
    references: [ProjectTable.id],
  }),
  messages: many(MessageTable),
}))

export const messageRelations = relations(MessageTable, ({ one }) => ({
  session: one(SessionTable, {
    fields: [MessageTable.session_id],
    references: [SessionTable.id],
  }),
}))

export const databaseRelations = relations(DatabaseTable, ({ one }) => ({
  project: one(ProjectTable, {
    fields: [DatabaseTable.project_id],
    references: [ProjectTable.id],
  }),
}))

export const deploymentRelations = relations(DeploymentTable, ({ one }) => ({
  project: one(ProjectTable, {
    fields: [DeploymentTable.project_id],
    references: [ProjectTable.id],
  }),
}))

export const repositoryRelations = relations(RepositoryTable, ({ one, many }) => ({
  project: one(ProjectTable, {
    fields: [RepositoryTable.project_id],
    references: [ProjectTable.id],
  }),
  commits: many(CommitTable),
}))

export const commitRelations = relations(CommitTable, ({ one }) => ({
  repository: one(RepositoryTable, {
    fields: [CommitTable.repository_id],
    references: [RepositoryTable.id],
  }),
}))
