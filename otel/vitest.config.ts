import { mergeConfig, type ViteUserConfig } from "vitest/config"

import config from "../konfik/vitest.ts"

export default mergeConfig(config, {
  test: { name: "otel.crosshatch.dev" },
} satisfies ViteUserConfig)
