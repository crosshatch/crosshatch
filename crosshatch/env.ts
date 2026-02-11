import { Config, Effect } from "effect"

export const dev = Config.boolean("DEV").pipe(
  Config.withDefault(true),
  Effect.runSync,
)

export const domain = `${dev ? "local." : ""}crosshatch.dev`

export const appUrl = `https://${domain}`
