import { Config } from "effect"

export const config = {
  dev: Config.boolean("DEV").pipe(
    Config.withDefault(true),
  ),
}
