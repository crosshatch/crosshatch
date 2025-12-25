import * as Path from "node:path"
import type { ViteUserConfig } from "vitest/config"

export default {
  esbuild: { target: "es2020" },
  optimizeDeps: { exclude: [] },
  test: {
    setupFiles: [Path.join(import.meta.dirname, "vitest.setup.ts")],
    fakeTimers: { toFake: undefined },
    sequence: { concurrent: true },
    exclude: ["**/.git/**", "**/dist/**", "**/node_modules/**"],
  },
} satisfies ViteUserConfig
