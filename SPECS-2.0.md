# OpenCode Builder 2.0 - Plan Completo

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

## 1. Funcionalidades del Builder

### 1.1 Wizard de Configuración de Proyecto

**Tipos de proyecto:**

| Type       | Name        | Description              | Build Command       |
| ---------- | ----------- | ------------------------ | ------------------- |
| `blank`    | Blank       | Proyecto vacío           | (ninguno)           |
| `frontend` | Frontend    | SPA básica (HTML/JS/CSS) | (ninguno)           |
| `nodejs`   | Node.js API | API con Express/Fastify  | `node src/index.js` |
| `react`    | React       | React con Vite           | `npm run build`     |
| `vue`      | Vue         | Vue con Vite             | `npm run build`     |
| `svelte`   | Svelte      | Svelte con Vite          | `npm run build`     |
| `next`     | Next.js     | Next.js fullstack        | `npm run build`     |
| `custom`   | Custom      | Configuración manual     | definir             |

**Pasos del Wizard:**

1. Nombre y template
2. Base de datos (opcional)
3. Variables de entorno
4. Servicios adicionales (MCP)

### 1.2 Editor de Código

- Monaco Editor (VSCode)
- Syntax highlighting
- IntelliSense
- Multi-file editing

### 1.3 File Tree

- Explorador visual de archivos
- Crear/editar/borrar archivos
- Drag & drop

### 1.4 Terminal Integrada

- WebSocket a opencode serve
- xterm.js
- Comandos del sistema

### 1.5 Preview

- Blob URLs (desarrollo)
- GitHub Pages / Cloudflare Pages (producción)

### 1.6 Chat con IA

- Integración con opencode session.prompt
- Herramientas de código
- Auto-completion

### 1.7 Gestión de Bases de Datos

- D1 (SQLite)
- PostgreSQL (abstracción modular)
- UI para queries

### 1.8 Deployment

- Preview URLs
- Production deploy
- GitHub Pages integration

### 1.9 Importar Proyectos Existentes

```
┌─────────────────────────────────────────────────────────┐
│              Importar Proyecto Existente                 │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Selecciona una opción:                                 │
│  ┌─────────────────────────────────────────────────┐   │
│  │  GitHub        │ GitLab        │ Personal       │   │
│  │  ○             │ ○             │ ○              │   │
│  └─────────────────────────────────────────────────┘   │
│                                                          │
│  Si seleccionaste GitHub/GitLab:                        │
│  - Conectar cuenta (OAuth)                             │
│  - Seleccionar repositorio                             │
│  - Seleccionar rama                                     │
│  - Seleccionar directorio (si tiene subproyectos)      │
│                                                          │
│  Si seleccionaste Personal:                             │
│  - URL del repositorio (GitHub/GitLab/Bitbucket)       │
│  - Credenciales (opcional si es público)               │
│  - Branch a importar                                    │
│                                                          │
│  [Importar]                                              │
└─────────────────────────────────────────────────────────┘
```

**Flujo de importación:**

1. Usuario conecta su cuenta GitHub/GitLab
2. Lista de repositorios disponibles
3. Seleccionar repositorio + rama
4. Clone + análisis de estructura
5. Configuración automática basada en archivos detectados
6. Proyecto listo para usar

---

## 2. AI Assistants (Funcionalidades Avanzadas)

### 2.1 Code Review Assistant

- Revisión automática de código PR/commits
- Suggestions de mejoras
- Detectar code smells
- Best practices enforcement

### 2.2 Debugging Assistant

- Analizar errores y stack traces
- Sugerir fixes
- Explicar qué falla y por qué
- Reproducir errores en sandbox

### 2.3 Testing Generator

- Generar unit tests (Jest, Vitest, etc.)
- Generar integration tests
- Coverage analysis
- Property-based testing

### 2.4 Documentation Generator

- Auto-generar docs desde código
- README generator
- API docs (OpenAPI/Swagger)
- JSDoc/TSDoc

### 2.5 Refactoring Assistant

- Suggest refactors
- Migrate between frameworks
- Modernizar código legacy
- Extract methods/functions

### 2.6 Security Audit

- Scan vulnerabilidades (OWASP)
- Suggest security fixes
- Dependency audit (npm audit, etc.)
- Secret detection

### 2.7 Migration Tools

- Migrate between frameworks (React → Vue, Express → Fastify)
- Migrate between languages (JS → TS)
- Upgrade dependencies
- Migrate legacy code

### 2.8 CI/CD Generator

- GitHub Actions auto-generate
- GitLab CI
- Docker configs
- Kubernetes configs

### 2.9 Architecture Assistant

- Diagramas de arquitectura desde código
- Suggest patterns (SOLID, etc.)
- Code organization
- Component diagrams

### 2.10 Learning Mode

- Explicar código paso a paso
- Suggest learning resources
- Quiz mode para aprender
- Highlight concepts

### 2.11 Custom Agents

- Crear agentes con roles específicos
- "Frontend Expert", "Backend Expert", "DevOps Expert"
- Personalizados por proyecto
- Team-specific agents

### 2.12 Dependency Manager

- Suggest updates (major/minor/patch)
- Find vulnerabilities
- Audit deps
- Alternative packages

### 2.13 API Integration Helper

- Help integrar APIs de terceros
- Generate client code
- Handle auth (OAuth, API keys, etc.)
- Type generation from responses

### 2.14 Database Tools

- Schema design assistant
- Query optimization
- Migration helper
- ERD generation

### 2.15 Performance Optimizer

- Analyze performance
- Suggest optimizations
- Bundle analysis
- Lighthouse reports

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
│   │   ├── import/      → Importar de GitHub/GitLab
│   │   └── ai/          → AI Assistants
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
│   │   │   ├── import.ts      → /api/builder/import/*
│   │   │   ├── ai.ts          → /api/builder/ai/*
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
│   │   │   ├── index.tsx        → Dashboard
│   │   │   ├── project/
│   │   │   │   ├── [id].tsx     → Editor principal
│   │   │   │   ├── wizard.tsx   → Wizard de creación
│   │   │   │   └── settings.tsx → Configuración
│   │   │   ├── import.tsx       → Importar proyecto
│   │   │   └── ai/
│   │   │       ├── review.tsx   → Code Review
│   │   │       ├── debug.tsx    → Debugging
│   │   │       ├── test.tsx     → Testing
│   │   │       └── docs.tsx     → Documentation
│   │   ├── components/
│   │   │   ├── editor/          → Monaco Editor
│   │   │   ├── file-tree/       → Explorador de archivos
│   │   │   ├── terminal/        → xterm.js
│   │   │   ├── preview/         → iframe preview
│   │   │   ├── chat/            → Chat con IA
│   │   │   └── ai/              → AI assistants UI
│   │   ├── contexts/
│   │   │   ├── project.ts       → Estado del proyecto
│   │   │   ├── sdk.ts           → SDK client
│   │   │   └── terminal.ts      → Terminal WebSocket
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

### Implementaciones:

| Adapter           | Descripción          | Uso                   |
| ----------------- | -------------------- | --------------------- |
| `D1Adapter`       | SQLite en Cloudflare | Producción            |
| `PostgresAdapter` | PostgreSQL           | Producción (escalado) |
| `MemoryAdapter`   | In-memory            | Desarrollo            |

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
  type: text("type").notNull(),
  config: text("config"),
  status: text("status").notNull(),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
})

export const RepositoryTable = sqliteTable("repository", {
  id: text("id").primaryKey(),
  projectId: text("project_id")
    .notNull()
    .references(() => ProjectTable.id),
  provider: text("provider").notNull(), // github, gitlab, bitbucket
  repoUrl: text("repo_url").notNull(),
  branch: text("branch").notNull(),
  lastSync: integer("last_sync").notNull(),
})

export const DatabaseTable = sqliteTable("database", {
  id: text("id").primaryKey(),
  projectId: text("project_id")
    .notNull()
    .references(() => ProjectTable.id),
  provider: text("provider").notNull(),
  name: text("name").notNull(),
  d1Id: text("d1_id"),
  connectionString: text("connection_string"),
  status: text("status").notNull(),
  createdAt: integer("created_at").notNull(),
})

export const DeploymentTable = sqliteTable("deployment", {
  id: text("id").primaryKey(),
  projectId: text("project_id")
    .notNull()
    .references(() => ProjectTable.id),
  type: text("type").notNull(),
  url: text("url"),
  status: text("status").notNull(),
  commit: text("commit"),
  createdAt: integer("created_at").notNull(),
})
```

---

## 6. API Routes (Cloudflare Workers)

### Autenticación

| Método | Endpoint                    | Descripción    |
| ------ | --------------------------- | -------------- |
| GET    | `/api/builder/auth/me`      | Usuario actual |
| POST   | `/api/builder/auth/refresh` | Refresh token  |

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

### Importar

| Método | Endpoint                           | Descripción         |
| ------ | ---------------------------------- | ------------------- |
| GET    | `/api/builder/import/github/repos` | Listar repos GitHub |
| POST   | `/api/builder/import/github`       | Importar de GitHub  |
| GET    | `/api/builder/import/gitlab/repos` | Listar repos GitLab |
| POST   | `/api/builder/import/gitlab`       | Importar de GitLab  |
| POST   | `/api/builder/import/url`          | Importar desde URL  |

### AI Assistants

| Método | Endpoint                   | Descripción    |
| ------ | -------------------------- | -------------- |
| POST   | `/api/builder/ai/review`   | Code Review    |
| POST   | `/api/builder/ai/debug`    | Debugging      |
| POST   | `/api/builder/ai/test`     | Generar tests  |
| POST   | `/api/builder/ai/docs`     | Generar docs   |
| POST   | `/api/builder/ai/refactor` | Refactorizar   |
| POST   | `/api/builder/ai/security` | Security audit |

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

---

## 7. UI - Componentes

### Wizard de Creación

```
┌─────────────────────────────────────────────────────────┐
│                    Crear Proyecto                        │
├─────────────────────────────────────────────────────────┤
│  Paso 1 de 4: Tipo de Proyecto                          │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐       │
│  │  Blank  │ │Frontend │ │ Node.js │ │ Custom  │       │
│  │    □    │ │   □     │ │    □    │ │   □     │       │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘       │
│  [Anterior]                      [Siguiente →]         │
└─────────────────────────────────────────────────────────┘
```

### Importar Proyecto

```
┌─────────────────────────────────────────────────────────┐
│              Importar Proyecto Existente                 │
├─────────────────────────────────────────────────────────┤
│  ┌───────────┐ ┌───────────┐ ┌───────────┐            │
│  │  GitHub   │ │  GitLab   │ │    URL    │            │
│  │    ( )    │ │    ( )    │ │    ( )    │            │
│  └───────────┘ └───────────┘ └───────────┘            │
│                                                          │
│  Si GitHub:                                              │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Seleccionar repositorio...                    ▼  │   │
│  └─────────────────────────────────────────────────┘   │
│                                                          │
│  [Conectar GitHub]  [Importar]                          │
└─────────────────────────────────────────────────────────┘
```

### Editor Principal

```
┌────────────────────────────────────────────────────────────────┐
│  Proyecto: Mi API  │  Preview: 🔗 url  │  Deploy: [Btn]     │
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

### AI Assistants Panel

```
┌────────────────────────────────────────────────────────────────┐
│  AI Assistants                                    [_] [x]      │
├────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ [Review] [Debug] [Test] [Docs] [Refactor] [Security]   │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                          │
│  Revisión de código:                                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ ✅ No hay vulnerabilidades detectadas               │   │
│  │ ⚠️  Considera usar const en lugar de let           │   │
│  │ 💡 La función x puede ser async                     │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                          │
│  [Aplicar suggestions]  [Ignorar]                         │
└────────────────────────────────────────────────────────┘
```

---

## 8. Plan de Implementación (Fases)

### Fase 1: Setup y Base (Semana 1)

- [ ] Crear `packages/builder-core` con schema D1
- [ ] Crear `packages/builder-api` con Cloudflare Workers
- [ ] Configurar D1 y migraciones
- [ ] Integrar auth del Console

### Fase 2: CRUD Proyectos (Semana 2)

- [ ] API de proyectos
- [ ] API de archivos
- [ ] UI básica del dashboard

### Fase 3: Editor y Preview (Semana 3)

- [ ] Monaco Editor
- [ ] File tree component
- [ ] Preview con Blob URLs

### Fase 4: Terminal (Semana 4)

- [ ] WebSocket a opencode serve
- [ ] xterm.js
- [ ] Comandos básicos

### Fase 5: Bases de Datos (Semana 5)

- [ ] D1 integration
- [ ] PostgreSQL abstraction
- [ ] UI de queries

### Fase 6: Chat IA (Semana 6)

- [ ] session.prompt integration
- [ ] UI del chat

### Fase 7: Deployment (Semana 7)

- [ ] GitHub Pages integration
- [ ] URLs de preview

### Fase 8: Importar Proyectos (Semana 8)

- [ ] GitHub OAuth
- [ ] GitLab OAuth
- [ ] Import desde URL
- [ ] Detección automática de framework

### Fase 9: AI Assistants (Semanas 9-12)

- [ ] Code Review Assistant
- [ ] Debugging Assistant
- [ ] Testing Generator
- [ ] Documentation Generator
- [ ] Refactoring Assistant
- [ ] Security Audit

### Fase 10: AI Assistants II (Semanas 13-16)

- [ ] CI/CD Generator
- [ ] Dependency Manager
- [ ] API Integration Helper
- [ ] Performance Optimizer

### Fase 11: Wizard y polish (Semanas 17-18)

- [ ] Wizard de configuración
- [ ] Mejoras UI/UX
- [ ] Tests y documentación

---

## 9. Costos Estimados (Monthly)

| Recurso            | Uso            | Costo       |
| ------------------ | -------------- | ----------- |
| Cloudflare Workers | API + Server   | $5/mes      |
| D1 (SQLite)        | 5GB            | $5/mes      |
| Cloudflare Pages   | 500MB          | Gratis      |
| R2 Storage         | 1GB (archivos) | Gratis      |
| **Total**          |                | **$10/mes** |

_(Más usuarios = más D1 = ~$5/mes por cada 5GB extra)_

---

## 10. Diferencias con Competidores

| Feature     | v0         | Replit     | OpenCode Builder         |
| ----------- | ---------- | ---------- | ------------------------ |
| Editor      | Propio     | Monaco     | Monaco                   |
| IA          | v0.sh      | Agent      | OpenCode + AI Assistants |
| DB          | PostgreSQL | PostgreSQL | SQLite + PostgreSQL      |
| Import      | No         | No         | **GitHub/GitLab/URL**    |
| AI Features | Básico     | Limitado   | **12+ AI Assistants**    |
| Deploy      | Vercel     | Propio     | GitHub Pages             |

---

## 11. Stack Técnico

| Capa     | Tecnología                         |
| -------- | ---------------------------------- |
| UI       | SolidJS + Tailwind + Monaco Editor |
| API      | Cloudflare Workers + Hono          |
| Auth     | Console (OAuth + JWT)              |
| Storage  | D1 + PostgreSQL + Memory           |
| Preview  | Blob URLs + GitHub Pages           |
| Core IA  | opencode serve                     |
| Terminal | xterm.js + WebSocket               |
| AI       | OpenCode Tools + Custom Tools      |

---

## 12. Modelo de Instancias

### Recomendación: Servidor Centralizado

- Un solo `opencode serve` para todos los usuarios
- Aislamiento por directorio: `/users/{user-id}/projects/{project-id}/`
- IP compartida (cumple requisitos de privacidad)
- Escalable a instancias dedicadas si es necesario

---

## 13. Notas

### Importar desde GitHub

- OAuth con GitHub para acceso a repos
- Soporte para repos públicos y privados
- Detección automática de framework basado en archivos

### Importar desde GitLab

- OAuth con GitLab
- Group/Subgroup support
- Pipeline CI detection

### Importar desde URL

- Clone de cualquier repositorio público
- GitHub, GitLab, Bitbucket, custom Git

---

_Documento generado: 2026-03-28_
_Versión: 2.0_
