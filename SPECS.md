# OpenCode Builder - Plan de Implementación

## Visión General

OpenCode Builder es una plataforma de desarrollo web integral que permite a los usuarios crear, editar, previsualizar y desplegar proyectos web directamente desde el navegador. Similar a v0 o Replit, pero utilizando la potencia de OpenCode como motor de IA.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           OpenCode Builder                                  │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                        Usuario                                       │   │
│  │   1. Registra/Login → 2. Wizard → 3. Editor → 4. Preview/Deploy  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. Flujo de Usuario

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Auth       │───►│   Wizard     │───►│   Editor     │───►│   Preview    │
│ (Propia JWT) │    │  (Config)    │    │  (Monaco)    │    │  (Blob/GH)   │
└──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘
                                                  │
                                                  ▼
                                          ┌──────────────┐
                                          │   Deploy     │
                                          │ (Cloudflare) │
                                          └──────────────┘
```

---

## 2. Wizard de Configuración de Proyecto

### Templates Predefinidos

Los proyectos se crean desde templates preconfigurados que garantizan que el proyecto compila correctamente desde el inicio.

**Ubicación:** `packages/builder/templates/`

#### Tipos de Templates

| Type              | Name            | Template         | Stack                         | Build Command       |
| ----------------- | --------------- | ---------------- | ----------------------------- | ------------------- |
| `blank`           | Blank           | (vacío)          | -                             | -                   |
| `static`          | Estático        | Astro            | Astro + buen rendimiento      | `npm run build`     |
| `spa`             | SPA             | Svelte + Vite    | Svelte + TypeScript           | `npm run build`     |
| `spa-react`       | SPA React       | React + Vite     | React + TypeScript            | `npm run build`     |
| `spa-vue`         | SPA Vue         | Vue + Vite       | Vue + TypeScript              | `npm run build`     |
| `fullstack`       | Fullstack       | Next.js          | Next.js (React) + TypeScript  | `npm run build`     |
| `fullstack-nuxt`  | Fullstack Nuxt  | Nuxt             | Nuxt (Vue) + TypeScript       | `npm run build`     |
| `backend`         | Backend Nest    | NestJS           | NestJS + TypeScript           | `npm run start:dev` |
| `backend-graphql` | Backend GraphQL | Apollo + Express | Apollo + GraphQL + TypeScript | `npm run start`     |
| `custom`          | Custom          | -                | Configuración manual          | definir             |

#### Estructura de un Template

```
packages/builder/templates/
├── static/
│   ├── package.json
│   ├── astro.config.mjs
│   ├── tsconfig.json
│   ├── src/
│   │   └── pages/
│   │       └── index.astro
│   └── README.md
├── spa-svelte/
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── index.html
│   └── src/
│       ├── App.svelte
│       └── main.ts
├── fullstack-next/
│   ├── package.json
│   ├── next.config.js
│   ├── tsconfig.json
│   ├── src/
│   │   ├── app/
│   │   │   └── page.tsx
│   │   └── lib/
│   └── README.md
├── backend-nest/
│   ├── package.json
│   ├── tsconfig.json
│   ├── nest-cli.json
│   └── src/
│       ├── app.module.ts
│       └── main.ts
├── backend-graphql/
│   ├── package.json
│   ├── tsconfig.json
│   ├── src/
│   │   ├── schema.ts
│   │   ├── resolvers/
│   │   └── index.ts
│   └── README.md
└── README.md (metadata de cada template)
```

#### Metadata del Template

```typescript
// packages/builder/templates/static/metadata.json
{
  "id": "static",
  "name": "Estático",
  "description": "Sitio estático con Astro - óptimo para blogs y landing pages",
  "category": "static",
  "tags": ["astro", "static", "fast"],
  "defaultSkills": ["astro-best-practices"],
  "ports": {
    "dev": 4321,
    "preview": 4321
  },
  "features": {
    "database": false,
    "api": false,
    "auth": false
  }
}

// packages/builder/templates/fullstack-next/metadata.json
{
  "id": "fullstack-next",
  "name": "Fullstack Next.js",
  "description": "Aplicación fullstack con Next.js - React + API routes",
  "category": "fullstack",
  "tags": ["nextjs", "react", "fullstack", "ssr"],
  "defaultSkills": ["nextjs-best-practices", "react-performance"],
  "ports": {
    "dev": 3000,
    "preview": 3000
  },
  "features": {
    "database": true,
    "api": true,
    "auth": true
  }
}

// packages/builder/templates/backend-nest/metadata.json
{
  "id": "backend-nest",
  "name": "Backend NestJS",
  "description": "Backend estructurado con NestJS - TypeScript, modular y escalable",
  "category": "backend",
  "tags": ["nestjs", "backend", "typescript", "api"],
  "defaultSkills": ["nestjs-structure", "typescript-strict", "api-rest-patterns"],
  "ports": {
    "dev": 3001,
    "preview": 3001
  },
  "features": {
    "database": true,
    "api": true,
    "auth": true
  }
}
```

### Skills por Template

Cada template viene con **skills por defecto** que guían a la IA en cómo escribir código.

#### Skills Predefinidas (incluidas en el template)

| Template          | Skills por Defecto                                              |
| ----------------- | --------------------------------------------------------------- |
| `static`          | `astro-best-practices`                                          |
| `spa-svelte`      | `svelte-best-practices`                                         |
| `spa-react`       | `react-best-practices`                                          |
| `spa-vue`         | `vue-best-practices`                                            |
| `fullstack-next`  | `nextjs-best-practices`, `react-performance`                    |
| `fullstack-nuxt`  | `nuxt-best-practices`                                           |
| `backend-nest`    | `nestjs-structure`, `typescript-strict`, `api-rest-patterns`    |
| `backend-graphql` | `apollo-graphql`, `typescript-strict`, `graphql-best-practices` |

#### Skills Adicionales (disponibles para agregar)

```
skills/
├── frontend/
│   ├── react-best-practices.json
│   ├── svelte-best-practices.json
│   ├── vue-best-practices.json
│   └── css-architecture.json
├── backend/
│   ├── nestjs-structure.json
│   ├── api-rest-patterns.json
│   ├── apollo-graphql.json
│   └── typescript-strict.json
├── database/
│   ├── drizzle-best-practices.json
│   ├── prisma-best-practices.json
│   └── sql-optimization.json
├── performance/
│   ├── react-performance.json
│   ├── bundle-optimization.json
│   └── image-optimization.json
└── security/
    ├── security-best-practices.json
    └── auth-patterns.json
```

#### Estructura de una Skill

```json
// packages/builder/templates/skills/react-best-practices.json
{
  "name": "react-best-practices",
  "description": "Best practices para desarrollo con React",
  "rules": [
    {
      "id": "use-hooks",
      "description": "Usar hooks en lugar de clases",
      "pattern": "class.*extends.*React\\.Component"
    },
    {
      "id": "functional-components",
      "description": "Preferir componentes funcionales",
      "example": "const MyComponent = () => { ... }"
    },
    {
      "id": "use-memo",
      "description": "Usar useMemo para cálculos costosos",
      "pattern": "useMemo"
    }
  ],
  "templates": {
    "page": "src/app/{name}/page.tsx",
    "component": "src/components/{name}.tsx",
    "api": "src/app/api/{name}/route.ts"
  },
  "conventions": {
    "fileNaming": "kebab-case",
    "componentNaming": "PascalCase",
    "cssModules": true
  }
}
```

### Skills Personalizadas por Usuario

Los usuarios pueden **crear y subir sus propias skills** a sus proyectos.

```typescript
interface UserSkill {
  id: string
  name: string
  description: string
  projectId: string
  rules: SkillRule[]
  templates: Record<string, string>
  createdAt: number
}

// API para gestionar skills de usuario
POST   /api/builder/projects/:id/skills     // Crear skill
GET    /api/builder/projects/:id/skills     // Listar skills
PUT    /api/builder/projects/:id/skills/:sid  // Actualizar
DELETE /api/builder/projects/:id/skills/:sid  // Eliminar
```

---

## 2.1 Storage y Persistencia

Todo el almacenamiento es **centralizado en D1** (SQLite en Cloudflare) para garantizar persistencia.

### Arquitectura de Storage

```
┌─────────────────────────────────────────────────────────────────┐
│                    Builder API (Workers)                         │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    D1 (SQLite)                           │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐             │   │
│  │  │Projects  │  │ Sessions │  │ Messages │             │   │
│  │  │          │  │ (Chat)   │  │          │             │   │
│  │  └──────────┘  └──────────┘  └──────────┘             │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    R2 (Archivos)                                │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Archivos de proyectos (código fuente)                │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### Tablas de Base de Datos

```typescript
// packages/builder-core/src/schema/builder.sql.ts
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core"

// Proyectos del usuario
export const ProjectTable = sqliteTable("project", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  type: text("type").notNull(), // static, spa, fullstack, backend
  config: text("config"), // JSON completo
  status: text("status").notNull(), // creating, active, error
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
})

// Sesiones de chat (cada chat = una sesión)
export const SessionTable = sqliteTable("session", {
  id: text("id").primaryKey(),
  projectId: text("project_id")
    .notNull()
    .references(() => ProjectTable.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
})

// Mensajes del chat
export const MessageTable = sqliteTable("message", {
  id: text("id").primaryKey(),
  sessionId: text("session_id")
    .notNull()
    .references(() => SessionTable.id, { onDelete: "cascade" }),
  role: text("role").notNull(), // user, assistant
  content: text("content").notNull(),
  toolCalls: text("tool_calls"), // JSON de tool calls
  createdAt: integer("created_at").notNull(),
})

// Bases de datos del proyecto (D1/Postgres)
export const DatabaseTable = sqliteTable("database", {
  id: text("id").primaryKey(),
  projectId: text("project_id")
    .notNull()
    .references(() => ProjectTable.id, { onDelete: "cascade" }),
  provider: text("provider").notNull(), // sqlite, postgres
  name: text("name").notNull(),
  d1Id: text("d1_id"), // ID de D1 si es SQLite
  connectionString: text("connection_string"),
  status: text("status").notNull(),
  createdAt: integer("created_at").notNull(),
})

// Deployments
export const DeploymentTable = sqliteTable("deployment", {
  id: text("id").primaryKey(),
  projectId: text("project_id")
    .notNull()
    .references(() => ProjectTable.id, { onDelete: "cascade" }),
  type: text("type").notNull(), // preview, production
  url: text("url"),
  status: text("status").notNull(),
  commit: text("commit"),
  createdAt: integer("created_at").notNull(),
})

// Repositorios importados
export const RepositoryTable = sqliteTable("repository", {
  id: text("id").primaryKey(),
  projectId: text("project_id")
    .notNull()
    .references(() => ProjectTable.id, { onDelete: "cascade" }),
  provider: text("provider").notNull(), // github, gitlab, bitbucket
  repoUrl: text("repo_url").notNull(),
  branch: text("branch").notNull(),
  lastSync: integer("last_sync").notNull(),
})
```

### Persistencia del Chat

El chat usa las tablas `Session` y `Message`:

- Cada proyecto puede tener múltiples sesiones de chat
- Los mensajes incluyen role (user/assistant) y content
- Los tool calls se guardan en JSON para referencia

### Archivos del Proyecto

Los archivos de código fuente se almacenan en:

- **Desarrollo**: Blob URLs (memoria temporal)
- **Producción**: GitHub (código) + GitHub Pages (preview)

### Resumen de Persistencia

| Componente      | Storage     | Persistencia  | Notas                  |
| --------------- | ----------- | ------------- | ---------------------- |
| Proyectos       | D1          | ✅ Permanente | Metadatos del proyecto |
| Chat/Sessions   | D1          | ✅ Permanente | Mensajes completos     |
| Código fuente   | GitHub      | ✅ Permanente | Commits automáticos    |
| Archivos (dev)  | Memory/Blob | ❌ Temporal   | Solo en memoria        |
| Bases de datos  | D1/Postgres | ✅ Permanente | Datos del usuario      |
| Templates       | Código      | ✅ Permanente | En el repo             |
| Version Control | GitHub      | ✅ Permanente | Historial de cambios   |

---

## 2.2 Sistema de Version Control (Git)

Cada proyecto tiene su propio repositorio GitHub para almacenamiento y versionado del código.

### Flujo de Funcionamiento

```
┌─────────────────────────────────────────────────────────────────┐
│                      Usuario                                     │
│   1. Conecta cuenta GitHub (OAuth / GitHub App)               │
│   2. Crea proyecto → Se crea repo (público/privado)           │
│   3. Chat genera código → Commits automáticos                 │
│   4. Navegar timeline → Ver historial de cambios              │
└─────────────────────────────────────────────────────────────────┘
```

### GitHub Integration

**Conexión:** GitHub App (más permisos que OAuth simple)

**Repositorio:**

- Se crea automáticamente al crear el proyecto
- Público por defecto (usuario puede cambiar a privado)
- Nombre: `opencode-builder-{project-id}` o definido por usuario

### Commits Automáticos

**Cuándo se hace commit:**

- Solo cuando hay cambios de código
- No cada mensaje de chat

**Estrategia de commits:**

- Batch cada **30 minutos** si hay cambios pendientes
- O cuando se acumulen **50 cambios pendientes**
- Un commit puede incluir múltiples archivos

```
Chat: "Agrega formulario de contacto"
    │
    ▼
AI genera código (cambios en memoria)
    │
    ▼
[30 min] o [50 cambios] → Commit
    │
    ▼
GitHub: "Agregar formulario de contacto"
```

### Esquema de Commits

```typescript
interface CommitInfo {
  message: string // Resumen del cambio
  files: string[] // Archivos cambiados
  chatMessageId: string // Referencia al mensaje del chat
  timestamp: number // Cuando se hizo
  author: {
    name: string // "OpenCode Builder"
    email: string // "builder@opencode.ai"
  }
}
```

### Historial y Timeline

La UI muestra una línea de tiempo visual:

```
┌─────────────────────────────────────────────────────────────────┐
│ Timeline del Proyecto                                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ● ──── Agregar formulario de contacto (2 archivos)           │
│  │    Hace 5 minutos                                           │
│  │     Commit: a1b2c3d                                          │
│  │                                                              │
│  ● ──── Crear componente Header (1 archivo)                    │
│  │    Hace 1 hora                                              │
│  │     Commit: e5f6g7h                                          │
│  │                                                              │
│  ● ──── Configurar Tailwind CSS (3 archivos)                   │
│  │    Hace 3 horas                                             │
│  │     Commit: i9j0k1l                                          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Cada punto del timeline:**

- Muestra el resumen del cambio
- Archivos afectados
- Referencia al chat message
- Click para ver diff

### Tabla de Git en D1

```typescript
// Información del repositorio
export const RepositoryTable = sqliteTable("repository", {
  id: text("id").primaryKey(),
  projectId: text("project_id")
    .notNull()
    .references(() => ProjectTable.id, { onDelete: "cascade" }),
  owner: text("owner").notNull(), // GitHub owner
  repo: text("repo").notNull(), // GitHub repo name
  isPrivate: integer("is_private").notNull(), // público/privado
  branch: text("branch").notNull(), // main por defecto
  githubInstallId: text("github_install_id"), // GitHub App installation
  lastCommitSha: text("last_commit_sha"),
  lastSync: integer("last_sync").notNull(),
})

// Commits realizados
export const CommitTable = sqliteTable("commit", {
  id: text("id").primaryKey(),
  projectId: text("project_id")
    .notNull()
    .references(() => ProjectTable.id, { onDelete: "cascade" }),
  sha: text("sha").notNull(),
  message: text("message").notNull(),
  files: text("files").notNull(), // JSON array
  chatMessageId: text("chat_message_id"),
  createdAt: integer("created_at").notNull(),
})
```

### APIs de Git

```typescript
// Repositorio
POST   /api/builder/projects/:id/repo           // Crear repo
GET    /api/builder/projects/:id/repo           // Info del repo
PUT    /api/builder/projects/:id/repo           // Actualizar (publico/privado)

// Commits
GET    /api/builder/projects/:id/commits       // Lista de commits
GET    /api/builder/projects/:id/commits/:sha   // Detalle del commit

// Timeline
GET    /api/builder/projects/:id/timeline      // Timeline del proyecto
```

### Rate Limiting

GitHub tiene límites de rate limiting:

| Acción    | Límite           |
| --------- | ---------------- |
| Commits   | 5000/hora (auth) |
| API calls | 5000/hora (auth) |

**Estrategia:**

- Commits en batch (no uno por uno)
- Cola de espera si se alcanza el límite
- Reintento automático

---

### Paso 2: Base de Datos (Opcional)

```typescript
interface DatabaseConfig {
  provider: "sqlite" | "postgres" // "sqlite" = D1, "postgres" = external
  name: string
}
```

### Paso 3: Entorno y Variables

```typescript
interface EnvironmentConfig {
  variables: Record<string, string>
  secrets: string[] // Keys que el usuario debe completar
}
```

### Paso 4: Servicios Adicionales (MCP)

```typescript
interface ServiceConfig {
  mcpServers: {
    name: string
    config: Record<string, any>
  }[]
}
```

---

## 3. Arquitectura de Paquetes

```
packages/
├── console/           (extender)
│   └── core/         → Users, Auth, Billing, Plans, Workspaces
│
├── builder-core/     (NUEVO - lógica de negocio)
│   ├── src/
│   │   ├── project/     → CRUD de proyectos
│   │   ├── database/   → Gestión de DBs (D1/Postgres)
│   │   ├── deploy/      → Lógica de deployment
│   │   ├── storage/     → Abstracción de storage
│   │   ├── wizard/      → Configuraciones de proyecto
│   │   └── skills/      → Gestión de skills
│   ├── templates/       → Proyectos predefinidos
│   │   ├── static/      → Astro template
│   │   ├── spa-svelte/  → Svelte + Vite
│   │   ├── spa-react/   → React + Vite
│   │   ├── spa-vue/     → Vue + Vite
│   │   ├── fullstack-next/  → Next.js
│   │   ├── fullstack-nuxt/  → Nuxt
│   │   ├── backend-nest/    → NestJS
│   │   └── backend-graphql/  → Apollo GraphQL
│   └── migrations/      → Drizzle migrations
│
├── builder-api/      (NUEVO - Cloudflare Workers)
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.ts        → /api/builder/auth/*
│   │   │   ├── projects.ts    → /api/builder/projects/*
│   │   │   ├── files.ts       → /api/builder/files/*
│   │   │   ├── database.ts    → /api/builder/database/*
│   │   │   ├── deploy.ts      → /api/builder/deploy/*
│   │   │   ├── session.ts     → /api/builder/sessions/*
│   │   │   ├── chat.ts        → /api/builder/chat/*
│   │   │   └── terminal.ts    → WS /api/builder/terminal/*
│   │   ├── middleware/
│   │   │   ├── auth.ts        → JWT validation
│   │   │   ├── limits.ts      → Rate limits por plan
│   │   │   └── project.ts     → Proyecto actual
│   │   └── index.ts           → Entry point
│   └── wrangler.toml
│
├── builder/          (NUEVO - UI SolidJS)
│   ├── src/
│   │   ├── routes/
│   │   │   ├── index.tsx       → Dashboard
│   │   │   ├── project/
│   │   │   │   ├── [id].tsx    → Editor principal
│   │   │   │   ├── wizard.tsx  → Wizard de creación
│   │   │   │   └── settings.tsx → Configuración
│   │   │   └── api.tsx         → API routes
│   │   ├── components/
│   │   │   ├── editor/         → Monaco Editor
│   │   │   ├── file-tree/      → Explorador de archivos
│   │   │   ├── terminal/       → xterm.js
│   │   │   ├── preview/        → iframe preview
│   │   │   ├── chat/           → Chat con IA
│   │   │   ├── chat-input/    → Input del chat
│   │   │   ├── chat-message/  → Mensajes del chat
│   │   │   ├── session-list/   → Lista de sesiones
│   │   │   └── ai-panel/      → AI Assistants
│   │   ├── contexts/
│   │   │   ├── project.ts      → Estado del proyecto
│   │   │   ├── sdk.ts         → SDK client
│   │   │   └── terminal.ts    → Terminal WebSocket
│   │   └── styles/
│   └── index.html
│
└── opencode/         (existente - sin cambios)
    └── src/
        └── server/  → opencode serve
```

---

## 4. Storage Abstraction (Modular)

```typescript
// packages/builder-core/src/storage/adapter.ts
export interface StorageAdapter {
  query<T>(sql: string, params?: any[]): Promise<T[]>
  execute(sql: string, params?: any[]): Promise<void>
  transaction<T>(fn: () => Promise<T>): Promise<T>
}
```

### D1Adapter (SQLite)

```typescript
// packages/builder-core/src/storage/d1-adapter.ts
export class D1Adapter implements StorageAdapter {
  constructor(private db: D1Database) {}

  async query<T>(sql: string, params?: any[]): Promise<T[]> {
    const stmt = this.db.prepare(sql)
    return params ? stmt.bind(...params).all() : stmt.all()
  }

  async execute(sql: string, params?: any[]): Promise<void> {
    const stmt = this.db.prepare(sql)
    ;(await params) ? stmt.bind(...params).run() : stmt.run()
  }

  async transaction<T>(fn: () => Promise<T>): Promise<T> {
    return this.db.batch(async (stmt) => {
      // Transaction logic
    })
  }
}
```

### PostgresAdapter

```typescript
// packages/builder-core/src/storage/postgres-adapter.ts
export class PostgresAdapter implements StorageAdapter {
  constructor(private pool: Pool) {}

  async query<T>(sql: string, params?: any[]): Promise<T[]> {
    const result = await this.pool.query(sql, params)
    return result.rows
  }

  async execute(sql: string, params?: any[]): Promise<void> {
    await this.pool.query(sql, params)
  }

  async transaction<T>(fn: () => Promise<T>): Promise<T> {
    const client = await this.pool.connect()
    try {
      await client.query("BEGIN")
      const result = await fn()
      await client.query("COMMIT")
      return result
    } catch (e) {
      await client.query("ROLLBACK")
      throw e
    } finally {
      client.release()
    }
  }
}
```

### MemoryAdapter (Desarrollo)

```typescript
// packages/builder-core/src/storage/memory-adapter.ts
export class MemoryAdapter implements StorageAdapter {
  private tables = new Map<string, Map<string, any>>()

  async query<T>(sql: string, params?: any[]): Promise<T[]> {
    // In-memory query implementation
    return []
  }

  async execute(sql: string, params?: any[]): Promise<void> {
    // In-memory execute (no-op)
  }

  async transaction<T>(fn: () => Promise<T>): Promise<T> {
    return fn()
  }
}
```

---

## 5. Base de Datos (D1 Schema)

```typescript
// packages/builder-core/src/schema/builder.sql.ts
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core"

export const ProjectTable = sqliteTable("project", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),

  // Configuración del wizard
  type: text("type").notNull(), // blank, frontend, nodejs, custom
  config: text("config"), // JSON con configuración completa

  // Estado
  status: text("status").notNull(), // creating, active, error
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
})

export const DatabaseTable = sqliteTable("database", {
  id: text("id").primaryKey(),
  projectId: text("project_id")
    .notNull()
    .references(() => ProjectTable.id),
  provider: text("provider").notNull(), // sqlite, postgres
  name: text("name").notNull(),
  d1Id: text("d1_id"), // ID de D1 si es SQLite
  connectionString: text("connection_string"), // Para Postgres
  status: text("status").notNull(), // creating, ready, error
  createdAt: integer("created_at").notNull(),
})

export const DeploymentTable = sqliteTable("deployment", {
  id: text("id").primaryKey(),
  projectId: text("project_id")
    .notNull()
    .references(() => ProjectTable.id),
  type: text("type").notNull(), // preview, production
  url: text("url"),
  status: text("status").notNull(), // building, deploying, ready, error
  commit: text("commit"),
  createdAt: integer("created_at").notNull(),
})
```

---

## 6. API Routes (Cloudflare Workers)

### Autenticación

| Método | Endpoint                     | Descripción      |
| ------ | ---------------------------- | ---------------- |
| POST   | `/api/builder/auth/login`    | Login usuario    |
| POST   | `/api/builder/auth/register` | Registro usuario |
| GET    | `/api/builder/auth/me`       | Usuario actual   |
| POST   | `/api/builder/auth/refresh`  | Refresh token    |

**Sistema de auth propia (JWT)** - Independiente del Console.

- Tokens JWT con expiración de 7 días
- Registro y login propios
- Middleware de validación en rutas protegidas

### Proyectos

| Método | Endpoint                    | Descripción         |
| ------ | --------------------------- | ------------------- |
| GET    | `/api/builder/projects`     | Listar proyectos    |
| POST   | `/api/builder/projects`     | Crear proyecto      |
| GET    | `/api/builder/projects/:id` | Obtener proyecto    |
| PUT    | `/api/builder/projects/:id` | Actualizar proyecto |
| DELETE | `/api/builder/projects/:id` | Eliminar proyecto   |

### Archivos

| Método | Endpoint                            | Descripción      |
| ------ | ----------------------------------- | ---------------- |
| GET    | `/api/builder/projects/:id/files`   | Listar archivos  |
| GET    | `/api/builder/projects/:id/files/*` | Leer archivo     |
| PUT    | `/api/builder/projects/:id/files/*` | Guardar archivo  |
| DELETE | `/api/builder/projects/:id/files/*` | Eliminar archivo |

### Bases de Datos

| Método | Endpoint                                          | Descripción    |
| ------ | ------------------------------------------------- | -------------- |
| GET    | `/api/builder/projects/:id/databases`             | Listar DBs     |
| POST   | `/api/builder/projects/:id/databases`             | Crear DB       |
| POST   | `/api/builder/projects/:id/databases/:dbid/query` | Ejecutar query |
| DELETE | `/api/builder/projects/:id/databases/:dbid`       | Eliminar DB    |

### Deployment

| Método | Endpoint                                       | Descripción        |
| ------ | ---------------------------------------------- | ------------------ |
| POST   | `/api/builder/projects/:id/deploy`             | Desplegar          |
| GET    | `/api/builder/projects/:id/deployments`        | Listar despliegues |
| GET    | `/api/builder/projects/:id/deployments/:depId` | Estado             |

### Terminal (WebSocket)

| Método | Endpoint                             | Descripción          |
| ------ | ------------------------------------ | -------------------- |
| WS     | `/api/builder/projects/:id/terminal` | Terminal interactiva |

### Chat / Sessions

| Método | Endpoint                                           | Descripción             |
| ------ | -------------------------------------------------- | ----------------------- |
| GET    | `/api/builder/projects/:id/sessions`               | Listar sesiones de chat |
| POST   | `/api/builder/projects/:id/sessions`               | Crear nueva sesión      |
| GET    | `/api/builder/projects/:id/sessions/:sid`          | Obtener sesión          |
| DELETE | `/api/builder/projects/:id/sessions/:sid`          | Eliminar sesión         |
| GET    | `/api/builder/projects/:id/sessions/:sid/messages` | Mensajes de la sesión   |
| POST   | `/api/builder/projects/:id/sessions/:sid/messages` | Enviar mensaje al chat  |

---

## 7. UI - Componentes

### Wizard de Creación

```
┌─────────────────────────────────────────────────────────┐
│                    Crear Proyecto                        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Paso 1 de 4: Tipo de Proyecto                          │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐       │
│  │  Blank  │ │Frontend │ │ Node.js │ │ Custom  │       │
│  │    □    │ │   □     │ │    □    │ │   □     │       │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘       │
│                                                          │
│  [Anterior]                      [Siguiente →]        │
└─────────────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────────┐
│                    Crear Proyecto                        │
├─────────────────────────────────────────────────────────┤
│  □ Base de Datos                                         │
│     Tipo: (•) SQLite  ( ) PostgreSQL                    │
│     Nombre: [________________________]                    │
│                                                          │
│  [Anterior]                      [Siguiente →]        │
└─────────────────────────────────────────────────────────┘
```

### Editor Principal

```
┌────────────────────────────────────────────────────────────────┐
│  Proyecto: Mi API  │  Preview: 🔗 url  │  Deploy: [Btn]       │
├──────────┬────────────────────────────────┬───────────────────┤
│ Files    │  Editor (Monaco)              │  Preview           │
│ ├ src/   │  ┌──────────────────────────┐ │  ┌─────────────┐ │
│ │ ├index │  │                          │ │  │             │ │
│ │ └app.js│  │  console.log("hello")   │ │  │  iframe    │ │
│ └ package│  │                          │ │  │             │ │
│   .json  │  │                          │ │  └─────────────┘ │
├──────────┴──┴──────────────────────────┴─┴───────────────────┤
│ Terminal                                                 │
│ $ _                                                      │
└──────────────────────────────────────────────────────────┘
┌────────────────────────────────────────────────────────────────┐
│ > Describe lo que querés hacer...                            │
└────────────────────────────────────────────────────────────────┘
```

---

## 8. Plan de Implementación (Fases)

### Fase 1: Setup y Base

- [x] Crear estructura de paquetes
- [x] Crear `packages/builder-core` con schema D1
- [x] Crear `packages/builder-api` con Cloudflare Workers
- [x] Crear `packages/builder` con UI base
- [x] Configurar D1 y migraciones
- [x] Implementar auth propia (JWT) - NO se conecta al Console
- [x] Configurar Tailwind y componentes base

### Fase 2: Templates Base

Desarrollo de los templates predefinidos:

- [ ] Template `static` (Astro)
  - package.json, astro.config.mjs, tsconfig.json
  - Estructura básica de páginas
  - Metadata del template
- [ ] Template `spa-svelte` (Svelte + Vite)
  - package.json, vite.config.ts, tsconfig.json
  - Componentes base
  - Metadata del template
- [ ] Template `spa-react` (React + Vite)
  - package.json, vite.config.ts, tsconfig.json
  - Componentes base
  - Metadata del template

### Fase 3: Templates Avanzados

- [ ] Template `spa-vue` (Vue + Vite)
- [ ] Template `fullstack-next` (Next.js)
  - App router, API routes setup
- [ ] Template `fullstack-nuxt` (Nuxt)
- [ ] Template `backend-nest` (NestJS)
  - Módulos base, controllers
- [ ] Template `backend-graphql` (Apollo + Express)
  - Schema, resolvers base

### Fase 4: CRUD Proyectos

- [ ] API de proyectos (list, create, read, update, delete)
- [ ] API de archivos (CRUD)
- [ ] UI básica del dashboard
- [ ] Integración con templates
- [ ] Clonar template al crear proyecto

### Fase 5: Editor y Preview

- [ ] Integrar Monaco Editor
- [ ] File tree component
- [ ] Preview con Blob URLs
- [ ] Integración editor ↔ file tree
- [ ] Sincronización de cambios

### Fase 6: Terminal

- [ ] WebSocket a opencode serve
- [ ] Integrar xterm.js
- [ ] Comandos básicos (npm install, npm run dev, etc.)
- [ ] Terminal en UI

### Fase 7: Git Versioning

- [ ] GitHub App setup y OAuth
- [ ] Crear repositorio automáticamente
- [ ] Sistema de commits batch (30 min / 50 cambios)
- [ ] APIs de git (commits, repo)
- [ ] Timeline visual en UI

### Fase 8: Bases de Datos

- [ ] Integración D1 (SQLite)
- [ ] Abstacción para PostgreSQL
- [ ] UI de queries
- [ ] Conexión de DBs por proyecto

### Fase 9: Chat IA

- [ ] Integración con session.prompt
- [ ] UI del chat
- [ ] Lista de sesiones
- [ ] Historial de mensajes
- [ ] Tool calls y resultados

### Fase 10: Importar Proyectos

- [ ] GitHub OAuth para importar
- [ ] Importar desde repositorio GitHub
- [ ] Importar desde GitLab
- [ ] Importar desde URL (git clone)
- [ ] Detección automática de framework

### Fase 11: Skills

- [ ] Skills por defecto de cada template
- [ ] Sistema de skills adicionales
- [ ] API para gestionar skills
- [ ] Skills personalizadas por usuario
- [ ] Integración con OpenCode

### Fase 12: Deployment

- [ ] GitHub Pages integration
- [ ] URLs de preview públicas
- [ ] Sistema de deployments
- [ ] Estado de deployment (building, ready, error)

### Fase 13: AI Assistants

- [ ] Code Review Assistant
- [ ] Debugging Assistant
- [ ] Testing Generator
- [ ] Documentation Generator
- [ ] Refactoring Assistant
- [ ] Security Audit
- [ ] CI/CD Generator
- [ ] Dependency Manager
- [ ] UI de AI Assistants

### Fase 14: Wizard y polish

- [ ] Wizard de configuración completo
- [ ] Mejoras UI/UX
- [ ] Optimización de performance
- [ ] Tests y documentación
- [ ] Beta testing

---

## 10. Diferencias con v0/Replit

| Feature | v0         | Replit     | OpenCode Builder     |
| ------- | ---------- | ---------- | -------------------- |
| Editor  | Propio     | Monaco     | Monaco               |
| IA      | v0.sh      | Agent      | OpenCode (existing!) |
| DB      | PostgreSQL | PostgreSQL | SQLite + PostgreSQL  |
| Deploy  | Vercel     | Propio     | GitHub Pages         |
| Precio  | $20/mes    | $20/mes    | **~$10-15/mes**      |

---

## 11. Stack Técnico

| Capa         | Tecnología                                  |
| ------------ | ------------------------------------------- |
| UI           | SolidJS + Tailwind + Monaco Editor          |
| API          | Cloudflare Workers + Hono                   |
| Auth         | Auth propia (JWT) - Independiente           |
| Storage      | D1 (SQLite) con abstracción para PostgreSQL |
| Preview Dev  | Blob URLs                                   |
| Preview Prod | GitHub Pages / Cloudflare Pages             |
| Core IA      | opencode serve (existente)                  |
| Terminal     | xterm.js + WebSocket                        |
| Editor       | Monaco Editor                               |

---

## 12. Notas de Infraestructura

### Instancias por Usuario vs Servidor Centralizado

**Recomendación: Servidor Centralizado al inicio**

- Un solo `opencode serve` para todos los usuarios
- Aislamiento por directorio: `/users/{user-id}/projects/{project-id}/`
- IP compartida (pero cumple requisitos de privacidad)
- Escalable a instancias dedicadas si es necesario

### Preview System

| Ambiente   | Solución                        | Notas              |
| ---------- | ------------------------------- | ------------------ |
| Desarrollo | Blob URLs                       | Instantáneo, local |
| Producción | GitHub Pages / Cloudflare Pages | URLs públicas      |

---

## 13. Autenticación

**Sistema propio (JWT)** - Independiente del Console

- Login/Registro propios con email + password
- Tokens JWT con expiración configurable
- Middleware de validación en rutas protegidas
- Puede integrarse con Console en fase futura si es necesario
- API keys por usuario/workspace (pendiente)

---

_Documento generado: 2026-03-28_
