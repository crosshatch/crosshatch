import { Config, Effect } from "effect"

export const dev = Config.boolean("DEV").pipe(
  Config.withDefault(true),
  Effect.runSync,
)
export const domain = `crosshatch.${dev ? "local" : "dev"}`
export const appUrl = `https://${domain}`
export const apiUrl = dev ? "http://localhost:7776" : "https://api.crosshatch.dev"
