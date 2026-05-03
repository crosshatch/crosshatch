import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    passWithNoTests: true,
    projects: ["./@crosshatch/*/vitest.config.ts", "./crosshatch/vitest.config.ts", "./liminal/*/vitest.config.ts"],
  },
})
