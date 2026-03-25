import { defineConfig } from "drizzle-kit"

export default defineConfig({
  dialect: "postgresql",
  out: "./migrations",
  schema: "./T.ts",
  verbose: true,
  migrations: { schema: "public" },
})
