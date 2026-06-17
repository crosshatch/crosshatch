import { existsSync, readFileSync } from "node:fs"

import { mergeConfig, type ViteUserConfig } from "vitest/config"

import config from "../../konfik/vitest.ts"

const root = new URL("../..", import.meta.url)
const envFile = new URL(".env", root)
const env = existsSync(envFile)
  ? Object.fromEntries(
      readFileSync(envFile, "utf8")
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line && !line.startsWith("#"))
        .map((line) => {
          const index = line.indexOf("=")
          return [line.slice(0, index), line.slice(index + 1).replace(/^['\"]|['\"]$/g, "")]
        }),
    )
  : {}

export default mergeConfig(config, {
  test: {
    env,
    name: "@crosshatch/facilitator",
  },
} satisfies ViteUserConfig)
