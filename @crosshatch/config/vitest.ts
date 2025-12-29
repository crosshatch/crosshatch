import * as Path from "node:path"
import type { ViteUserConfig } from "vitest/config"

export default {
  esbuild: { target: "es2020" },
  optimizeDeps: { exclude: [] },
  test: {
    environment: "happy-dom",
    setupFiles: [
      Path.join(import.meta.dirname, "vitest.setup.ts"),
      "fake-indexeddb/auto",
    ],
    fakeTimers: { toFake: undefined },
    sequence: { concurrent: true },
    exclude: ["**/dist/**", "**/node_modules/**"],
  },
} satisfies ViteUserConfig
