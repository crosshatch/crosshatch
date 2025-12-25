import config from "@crosshatch/config/vitest"
import { mergeConfig, type ViteUserConfig } from "vitest/config"

export default mergeConfig(
  config,
  {
    test: {
      projects: ["crosshatch", "@crosshatch/*", "examples/*"],
    },
  } satisfies ViteUserConfig,
)
