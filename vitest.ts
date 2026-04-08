import Path from "node:path"

import { defaultExclude, type ViteUserConfig } from "vitest/config"

export default {
  esbuild: { target: "es2020" },
  optimizeDeps: { exclude: [] },
  test: {
    environment: "happy-dom",
    exclude: defaultExclude,
    fakeTimers: { toFake: undefined },
    sequence: { concurrent: true },
    setupFiles: [Path.join(import.meta.dirname, "vitest.setup.ts"), "fake-indexeddb/auto"],
  },
} satisfies ViteUserConfig
