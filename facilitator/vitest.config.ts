import Process from "node:process"

import { loadEnv } from "vite"
import { mergeConfig, type ViteUserConfig } from "vitest/config"

import config from "../../konfik/vitest.ts"

export default mergeConfig(config, {
  test: {
    name: "facilitator.crosshatch.dev",
    env: loadEnv("test", Process.cwd(), ""),
  },
} satisfies ViteUserConfig)
