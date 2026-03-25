import { config } from "@dotenvx/dotenvx"
import { defineConfig } from "drizzle-kit"
import { Config, Effect } from "effect"

const dev = Config.boolean("DEV").pipe(Config.withDefault(true), Effect.runSync)
if (dev) {
  config({ path: "../.env" })
}
let url = Config.string("DATABASE_URL").pipe(Effect.runSync)

export default defineConfig({
  dialect: "postgresql",
  out: "./migrations",
  schema: "./T.ts",
  verbose: true,
  dbCredentials: { url },
  migrations: {
    schema: "public",
  },
})
