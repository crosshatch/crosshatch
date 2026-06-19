import Path from "node:path"

import { loadEnv } from "vite"
import { mergeConfig, type ViteUserConfig } from "vitest/config"

import config from "../../konfik/vitest.ts"

export default mergeConfig(config, {
  test: {
    name: "@crosshatch/facilitator",
    env: loadEnv("test", Path.resolve(import.meta.dirname, "../.."), ""),
  },
} satisfies ViteUserConfig)
