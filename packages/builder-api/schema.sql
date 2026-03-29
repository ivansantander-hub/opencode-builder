-- Create project table
CREATE TABLE IF NOT EXISTS project (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  template TEXT NOT NULL,
  owner_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  settings TEXT
);

CREATE INDEX IF NOT EXISTS project_owner_idx ON project(owner_id);
CREATE INDEX IF NOT EXISTS project_template_idx ON project(template);

-- Create session table
CREATE TABLE IF NOT EXISTS session (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  is_archived INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS session_project_idx ON session(project_id);

-- Create message table
CREATE TABLE IF NOT EXISTS message (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  metadata TEXT
);

CREATE INDEX IF NOT EXISTS message_session_idx ON message(session_id);

-- Create database table
CREATE TABLE IF NOT EXISTS database (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  connection_string TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'active'
);

CREATE INDEX IF NOT EXISTS database_project_idx ON database(project_id);

-- Create deployment table
CREATE TABLE IF NOT EXISTS deployment (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  type TEXT NOT NULL,
  status TEXT NOT NULL,
  url TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  metadata TEXT
);

CREATE INDEX IF NOT EXISTS deployment_project_idx ON deployment(project_id);

-- Create repository table
CREATE TABLE IF NOT EXISTS repository (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  provider TEXT NOT NULL,
  owner TEXT NOT NULL,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  is_private INTEGER NOT NULL DEFAULT 1
);

CREATE INDEX IF NOT EXISTS repository_project_idx ON repository(project_id);

-- Create git_commit table (commit is reserved)
CREATE TABLE IF NOT EXISTS git_commit (
  id TEXT PRIMARY KEY,
  repository_id TEXT NOT NULL,
  sha TEXT NOT NULL,
  message TEXT NOT NULL,
  author TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  url TEXT
);

CREATE INDEX IF NOT EXISTS git_commit_repository_idx ON git_commit(repository_id);
