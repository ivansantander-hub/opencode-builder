import { defineConfig } from "drizzle-kit"

export default defineConfig({
  schema: "./src/schema/*.sql.ts",
  out: "./migrations",
  dialect: "sqlite",
  driver: "d1",
  dbCredentials: {
    wranglerConfigPath: "./wrangler.toml",
    dbName: "builder-db",
  },
})
