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

- [ ] Crear package.json para builder-core
- [ ] Crear package.json para builder-api
- [ ] Crear package.json para builder
- [ ] Configurar turbo.json
- [ ] Agregar al root package.json

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

- [ ] `package.json` con dependencias (drizzle-orm, drizzle-kit, zod, etc.)
- [ ] `tsconfig.json`
- [ ] `drizzle.config.ts`
- [ ] Schema: ProjectTable
- [ ] Schema: SessionTable
- [ ] Schema: MessageTable
- [ ] Schema: DatabaseTable
- [ ] Schema: DeploymentTable
- [ ] Schema: RepositoryTable
- [ ] Schema: CommitTable
- [ ] Storage interface y adapters
- [ ] Proyecto base para CRUD

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

- [ ] `package.json` con dependencias (hono, jose, drizzle-orm, etc.)
- [ ] `wrangler.toml` configurado
- [ ] `tsconfig.json`
- [ ] Entry point con Hono app
- [ ] Middleware de auth (JWT)
- [ ] Middleware de rate limiting
- [ ] Middleware de proyecto
- [ ] Route: projects (CRUD)
- [ ] Route: files (CRUD)
- [ ] Route: databases
- [ ] Route: sessions
- [ ] Route: messages
- [ ] Route: deploy
- [ ] WebSocket para terminal
- [ ] Bindings para D1

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

- [ ] `package.json` con dependencias (solid-js, @solidjs/router, tailwindcss, etc.)
- [ ] `vite.config.ts`
- [ ] `tailwind.config.js`
- [ ] `tsconfig.json`
- [ ] `index.html`
- [ ] Entry point y app root
- [ ] Routing setup
- [ ] Tailwind setup
- [ ] Componentes UI base (Button, Input, Card, etc.)
- [ ] Layout header/sidebar
- [ ] Auth context
- [ ] SDK client context

---

## 1.5 Integrar auth del Console

**Objetivo:** Reutilizar autenticación existente

### Tareas:

- [ ] Investigar cómo funciona auth en console
- [ ] Crear middleware de auth en builder-api
- [ ] Integrar JWT validation
- [ ] Conectar con console auth
- [ ] Proteger rutas

---

## 1.6 D1 y Migraciones

**Objetivo:** Configurar base de datos

### Tareas:

- [ ] Crear cuenta en Cloudflare
- [ ] Crear D1 database
- [ ] Configurar wrangler.toml con D1 binding
- [ ] Generar migraciones con drizzle-kit
- [ ] Aplicar migraciones
- [ ] Testing de conexión

---

## 1.7 Configurar Tailwind y componentes base

**Objetivo:** Estilos y componentes reutilizables

### Tareas:

- [ ] Configurar Tailwind
- [ ] Crear tema de colores
- [ ] Crear componentes base:
  - Button
  - Input
  - Select
  - Card
  - Modal
  - Dropdown
  - Tabs
  - Toast

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

- [ ] `vitest.config.ts` en builder-core
- [ ] `vitest.config.ts` en builder-api
- [ ] `vitest.config.ts` en builder
- [ ] Setup global de tests
- [ ] Scripts de test en package.json

### 1.8.2 Tests Unitarios builder-core

**Schemas y tipos:**

- [ ] Test: ProjectTable schema validation
- [ ] Test: SessionTable schema validation
- [ ] Test: MessageTable schema validation
- [ ] Test: DatabaseTable schema validation
- [ ] Test: DeploymentTable schema validation
- [ ] Test: RepositoryTable schema validation

**Storage adapters:**

- [ ] Test: StorageAdapter interface
- [ ] Test: D1Adapter query
- [ ] Test: D1Adapter execute
- [ ] Test: D1Adapter transaction
- [ ] Test: MemoryAdapter (desarrollo)

**Lógica de negocio:**

- [ ] Test: Project CRUD operations
- [ ] Test: Session CRUD operations
- [ ] Test: Message operations
- [ ] Test: Validación de datos

### 1.8.3 Tests de Integración builder-api

**Middleware:**

- [ ] Test: JWT validation middleware
- [ ] Test: Rate limiting middleware
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

- [ ] Test: Button renders correctly
- [ ] Test: Button click handler
- [ ] Test: Input value binding
- [ ] Test: Card renders children
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

- [ ] git add .
- [ ] git commit -m "feat: Fase 1 - Setup y Base"
- [ ] git push fork dev

---

## Entregables de Fase 1

Al finalizar esta fase deberemos tener:

- ✅ Estructura de paquetes creada
- ✅ builder-core con schema D1
- ✅ builder-api con Cloudflare Workers
- ✅ builder con UI base SolidJS
- ✅ Auth integrada con Console
- ✅ D1 configurado con migraciones
- ✅ Tailwind y componentes base
- ✅ Testing configurado (Vitest)
- ✅ Tests unitarios de schemas
- ✅ Tests unitarios de storage adapters
- ✅ Tests de integración de API routes
- ✅ Tests de componentes UI
- ✅ Proyecto compilable
- ✅ Todos los tests passing

---

## Notas

- Usar las mismas convenciones del repo (TypeScript, Drizzle, Hono, SolidJS)
- Mantener código simple al inicio
- Documentar decisiones técnicas
- **Tests son obligatorios**: no hacer commit sin tests passing
- **Coverage mínimo**: 80% en código de negocio
- **Naming**: `*.test.ts` para unit, `*.integration.test.ts` para integración
