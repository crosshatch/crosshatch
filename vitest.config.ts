import { mergeConfig, type ViteUserConfig } from "vitest/config"
import config from "./vitest.config.ts"

export default mergeConfig(
  config,
  {
    test: {
      projects: ["crosshatch", "@crosshatch/*", "examples/*"],
    },
  } satisfies ViteUserConfig,
)
