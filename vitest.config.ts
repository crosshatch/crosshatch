import { mergeConfig, type ViteUserConfig } from "vitest/config"

import config from "./vitest.ts"

export default mergeConfig(config, {
  test: {
    projects: ["crosshatch", "@crosshatch/*", "examples/*"],
  },
} satisfies ViteUserConfig)
