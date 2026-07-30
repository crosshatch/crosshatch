import { defineConfig } from "oxlint"

import { baseConfig, rest } from "./konfik/oxlint/baseConfig.ts"
import { defineReactConfig } from "./konfik/oxlint/defineReactConfig.ts"

const restConfig = rest()

export default defineConfig({
  extends: [baseConfig, defineReactConfig(["docs/**/*"])],
  ...restConfig,
  rules: {
    ...restConfig.rules,
  },
})
