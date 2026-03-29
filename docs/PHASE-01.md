# Fase 1: Setup y Base

**Objetivo:** Crear la estructura base del proyecto

---

## 1.1 Crear estructura de paquetes

```bash
# Crear estructura de directorios
mkdir -p packages/builder-core/src/{project,database,deploy,storage,wizard,skills}
mkdir -p packages/builder-core/migrations
mkdir -p packages/builder-core/test/{unit,integration}
mkdir -p packages/builder-api/src/{routes,middleware}
mkdir -p packages/builder-api/test/{unit,integration}
mkdir -p packages/builder/src/{routes,components,contexts,styles}
mkdir -p packages/builder/test/{unit,integration,components}
```

**Tareas:**

- [x] Crear package.json para builder-core
- [x] Crear package.json para builder-api
- [x] Crear package.json para builder
- [x] Configurar turbo.json
- [x] Agregar al root package.json

---

## 1.2 packages/builder-core

**Objetivo:** Lógica de negocio, schemas D1, migraciones

### Archivos a crear:

```
packages/builder-core/
├── package.json
├── tsconfig.json
├── drizzle.config.ts
├── src/
│   ├── index.ts                 # Entry point
│   ├── schema/
│   │   └── builder.sql.ts       # Tablas: Project, Session, Message, Database, Deployment, Repository, Commit
│   ├── project/
│   │   ├── index.ts            # CRUD proyectos
│   │   └── types.ts
│   ├── database/
│   │   ├── index.ts            # Gestión de DBs
│   │   └── adapter.ts          # Storage interface
│   ├── storage/
│   │   ├── adapter.ts          # StorageAdapter interface
│   │   ├── d1-adapter.ts       # D1 implementation
│   │   ├── postgres-adapter.ts # PostgreSQL (futuro)
│   │   └── memory-adapter.ts   # Desarrollo
│   └── wizard/
│       ├── index.ts            # Configuraciones
│       └── templates.ts        # Templates disponibles
└── migrations/
    └── .gitkeep
```

### Checklist:

- [x] `package.json` con dependencias (drizzle-orm, drizzle-kit, zod, etc.)
- [x] `tsconfig.json`
- [x] `drizzle.config.ts`
- [x] Schema: ProjectTable
- [x] Schema: SessionTable
- [x] Schema: MessageTable
- [x] Schema: DatabaseTable
- [x] Schema: DeploymentTable
- [x] Schema: RepositoryTable
- [x] Schema: CommitTable
- [x] Storage interface y adapters
- [x] Proyecto base para CRUD
- [x] Relations entre tablas
- [x] Tests de schemas (7 tablas)

---

## 1.3 packages/builder-api

**Objetivo:** Cloudflare Workers con Hono

### Archivos a crear:

```
packages/builder-api/
├── package.json
├── tsconfig.json
├── wrangler.toml
├── src/
│   ├── index.ts                 # Entry point
│   ├── routes/
│   │   ├── auth.ts             # /api/builder/auth/*
│   │   ├── projects.ts         # /api/builder/projects/*
│   │   ├── files.ts            # /api/builder/files/*
│   │   ├── database.ts         # /api/builder/database/*
│   │   ├── deploy.ts           # /api/builder/deploy/*
│   │   ├── session.ts          # /api/builder/sessions/*
│   │   ├── chat.ts             # /api/builder/chat/*
│   │   └── terminal.ts         # WS /api/builder/terminal/*
│   └── middleware/
│       ├── auth.ts             # JWT validation
│       ├── limits.ts           # Rate limits
│       └── project.ts          # Proyecto actual
└── .gitignore
```

### Checklist:

- [x] `package.json` con dependencias (hono, jose, drizzle-orm, etc.)
- [x] `wrangler.toml` configurado
- [x] `tsconfig.json`
- [x] Entry point con Hono app
- [x] Middleware de auth (JWT)
- [x] Middleware de rate limiting
- [x] Middleware de proyecto
- [x] Route: projects (CRUD)
- [x] Route: files (CRUD)
- [x] Route: databases
- [x] Route: sessions
- [x] Route: messages
- [x] Route: deploy
- [ ] WebSocket para terminal (pendiente)
- [x] Bindings para D1

---

## 1.4 packages/builder

**Objetivo:** UI con SolidJS

### Archivos a crear:

```
packages/builder/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── index.html
├── src/
│   ├── index.tsx               # Entry point
│   ├── app.tsx                # App root
│   ├── routes/
│   │   ├── index.tsx          # Dashboard (/)
│   │   └── api.tsx            # API routes
│   ├── components/
│   │   ├── ui/                # Componentes base
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   └── ...
│   │   ├── layout/
│   │   │   ├── header.tsx
│   │   │   ├── sidebar.tsx
│   │   │   └── ...
│   │   └── ...
│   ├── contexts/
│   │   ├── auth.tsx           # Auth context
│   │   ├── project.tsx        # Project context
│   │   └── sdk.tsx            # SDK client
│   └── styles/
│       └── global.css
└── .gitignore
```

### Checklist:

- [x] `package.json` con dependencias (solid-js, @solidjs/router, tailwindcss, etc.)
- [x] `vite.config.ts`
- [x] `tailwind.config.js` (v4 usa CSS en lugar de config)
- [x] `tsconfig.json`
- [x] `index.html`
- [x] Entry point y app root
- [x] Routing setup
- [x] Tailwind setup
- [x] Componentes UI base (Button, Input, Card, etc.)
- [ ] Layout header/sidebar
- [x] Auth context
- [ ] SDK client context

---

## 1.5 Sistema de Autenticación

**Decisión:** Se implementa auth propia en lugar de reutilizar el Console.

### Por qué auth propia:

- **Independencia**: El Builder puede evolucionar sin depender del Console
- **Simplicidad**: Sistema JWT simple sin dependencias externas
- **Flexibilidad**: Puede integrarse con el Console más adelante si es necesario
- **Aislamiento**: Fallos en auth no afectan al Console principal

### Tareas:

- [x] Investigar cómo funciona auth en console
- [x] Crear middleware de auth en builder-api
- [x] Integrar JWT validation
- [x] Implementar auth propia (NO se conecta al Console)
- [x] Proteger rutas
- [x] Endpoint /api/builder/auth/login para generar tokens
- [x] Endpoint /api/builder/auth/register para registro
- [x] Componente LoginForm en frontend
- [x] Componente RegisterForm en frontend
- [x] Botón de logout en header
- [x] Switch entre login/registro

### Notas:

- El Console usa @openauthjs/openauth con GitHub/Google/Email
- La integración con Console queda pendiente para fase futura
- Los usuarios se almacenan en memoria (para producción usar D1)

---

## 1.6 D1 y Migraciones

**Objetivo:** Configurar base de datos

### Tareas:

- [ ] Crear cuenta en Cloudflare
- [ ] Crear D1 database
- [x] Configurar wrangler.toml con D1 binding
- [x] Generar migraciones con drizzle-kit (schema.sql)
- [x] Aplicar migraciones (D1 local)
- [ ] Testing de conexión

---

## 1.7 Configurar Tailwind y componentes base

**Objetivo:** Estilos y componentes reutilizables

### Tareas:

- [x] Configurar Tailwind
- [ ] Crear tema de colores
- [x] Crear componentes base:
  - [x] Button
  - [x] Input
  - [ ] Select
  - [x] Card
  - [ ] Modal
  - [ ] Dropdown
  - [ ] Tabs
  - [ ] Toast

---

## 1.8 Testing Setup

**Objetivo:** Configurar testing desde el inicio para evitar deuda técnica

### 1.8.1 Configuración de Testing

**Stack de testing:**

- **Unit tests**: Bun (nativo del repo) o Vitest
- **Integration tests**: Bun + supertest o Playwright
- **Component tests**: Vitest + @testing-library/solid

**Archivos de configuración:**

```
packages/builder-core/
├── vitest.config.ts          # Config Vitest
├── test/
│   ├── setup.ts             # Setup global
│   ├── unit/                # Tests unitarios
│   └── integration/         # Tests de integración

packages/builder-api/
├── vitest.config.ts
├── test/
│   ├── setup.ts
│   ├── unit/
│   └── integration/
│       ├── routes.test.ts   # Tests de API routes
│       └── auth.test.ts     # Tests de auth

packages/builder/
├── vitest.config.ts
├── test/
│   ├── setup.ts
│   ├── unit/
│   ├── integration/
│   └── components/         # Tests de componentes
```

### Checklist Testing:

- [x] `vitest.config.ts` en builder-core
- [x] `vitest.config.ts` en builder-api
- [x] `vitest.config.ts` en builder
- [x] Setup global de tests
- [x] Scripts de test en package.json

### 1.8.2 Tests Unitarios builder-core

**Schemas y tipos:**

- [x] Test: ProjectTable schema validation
- [x] Test: SessionTable schema validation
- [x] Test: MessageTable schema validation
- [x] Test: DatabaseTable schema validation
- [x] Test: DeploymentTable schema validation
- [x] Test: RepositoryTable schema validation
- [x] Test: CommitTable schema validation
- [x] Test: Relations entre tablas

**Storage adapters:**

- [x] Test: StorageAdapter interface
- [ ] Test: D1Adapter query (pendiente - usar en producción)
- [ ] Test: D1Adapter execute (pendiente - usar en producción)
- [ ] Test: D1Adapter transaction (pendiente - usar en producción)
- [x] Test: MemoryAdapter (desarrollo)

**Lógica de negocio:**

- [x] Test: Project CRUD operations
- [ ] Test: Session CRUD operations
- [ ] Test: Message operations
- [x] Test: Validación de datos

### 1.8.3 Tests de Integración builder-api

**Middleware:**

- [x] Test: JWT validation middleware
- [x] Test: Rate limiting middleware
- [ ] Test: Project context middleware

**Routes:**

- [ ] Test: GET /projects - 401 sin auth
- [ ] Test: GET /projects - 200 con auth
- [ ] Test: POST /projects - crear proyecto
- [ ] Test: GET /projects/:id - obtener proyecto
- [ ] Test: PUT /projects/:id - actualizar proyecto
- [ ] Test: DELETE /projects/:id - eliminar proyecto

**Errores:**

- [ ] Test: 404 para proyecto no existente
- [ ] Test: 403 para acceso denegado
- [ ] Test: 400 para datos inválidos

### 1.8.4 Tests de Componentes builder

**UI Components:**

- [x] Test: Button renders correctly
- [x] Test: Button click handler
- [x] Test: Input value binding
- [x] Test: Card renders children
- [ ] Test: Modal open/close

**Contexts:**

- [ ] Test: Auth context provides user
- [ ] Test: Project context provides project

### 1.8.5 Scripts de Testing

```json
{
  "scripts": {
    "test": "vitest",
    "test:unit": "vitest run",
    "test:integration": "vitest run --config vitest.integration.config.ts",
    "test:coverage": "vitest run --coverage"
  }
}
```

---

## 1.9 Push a GitHub

**Objetivo:** Subir cambios al repositorio

### Tareas:

- [x] git add .
- [x] git commit -m "feat: Fase 1 - Setup y Base"
- [x] git push --set-upstream fork feat/open-code-builder

---

## Entregables de Fase 1

Al finalizar esta fase deberemos tener:

- [x] Estructura de paquetes creada
- [x] builder-core con schema D1
- [x] builder-api con Cloudflare Workers
- [x] builder con UI base SolidJS
- [x] Auth implementada (JWT + login endpoint)
- [ ] Auth integrada con Console (pendiente conexión)
- [x] D1 configurado con migraciones (schema local)
- [x] Tailwind y componentes base (Button, Input, Card)
- [x] Testing configurado (Vitest)
- [x] Tests unitarios de schemas
- [x] Tests unitarios de storage adapters
- [x] Tests de integración de API routes (auth)
- [x] Tests de componentes UI
- [x] Tests E2E de autenticación
- [x] API Routes: files, sessions, messages, databases, deploy
- [x] Middleware de proyecto
- [x] Proyecto compilable
- [x] Todos los tests passing (70 tests)

---

## Notas

- Usar las mismas convenciones del repo (TypeScript, Drizzle, Hono, SolidJS)
- Mantener código simple al inicio
- Documentar decisiones técnicas
- **Tests son obligatorios**: no hacer commit sin tests passing
- **Coverage mínimo**: 80% en código de negocio
- **Naming**: `*.test.ts` para unit, `*.integration.test.ts` para integración
