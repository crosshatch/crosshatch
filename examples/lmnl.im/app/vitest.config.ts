import Path from "node:path"
import { defaultExclude, type ViteUserConfig } from "vitest/config"
import tsconfigPaths from "vite-tsconfig-paths"

export default {
  esbuild: { target: "es2020" },
  plugins: [
    tsconfigPaths({
      projects: ["./tsconfig.json"],
    }),
  ],
  test: {
    environment: "happy-dom",
    exclude: defaultExclude,
    fakeTimers: { toFake: undefined },
    name: "crosshatch.chat",
    sequence: { concurrent: true },
    setupFiles: [Path.join(import.meta.dirname, "../../vitest.setup.ts")],
  },
} satisfies ViteUserConfig
