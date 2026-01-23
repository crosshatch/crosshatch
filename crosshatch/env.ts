import { Config, Effect } from "effect"

export const dev = Config.boolean("DEV").pipe(
  Config.withDefault(true),
  Effect.runSync,
)
export const domain = `crosshatch.${dev ? "local" : "dev"}`
export const appUrl = `https://${domain}`
export const appAppsUrl = `${appUrl}/me/apps`
