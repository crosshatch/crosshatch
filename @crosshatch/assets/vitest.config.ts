import { mergeConfig, type ViteUserConfig } from "vitest/config"

import config from "../../konfik/vitest.ts"

export default mergeConfig(config, {
  test: {
    include: ["kit/@crosshatch/assets/**/*.test.ts"],
    name: "@crosshatch/assets",
  },
} satisfies ViteUserConfig)
