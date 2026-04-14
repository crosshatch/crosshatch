import { cloudflare } from "@cloudflare/vite-plugin"
import tailwind from "@tailwindcss/vite"
import { tanstackRouter } from "@tanstack/router-plugin/vite"
import react from "@vitejs/plugin-react"
import { fileURLToPath, URL } from "node:url"
import { defineConfig } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"

import migrations from "./plugin.ts"

export default defineConfig({
  envDir: "../../..",
  optimizeDeps: {
    exclude: [
      "@electric-sql/pglite",
      "@electric-sql/pglite/contrib/uuid_ossp",
      "@electric-sql/pglite/contrib/fuzzystrmatch",
      "@electric-sql/pglite/contrib/lo",
      "@electric-sql/pglite/contrib/vector",
      "@electric-sql/pglite/live",
      "@electric-sql/pglite/worker",
      "tiktoken/lite",
    ],
  },
  plugins: [
    migrations(),
    cloudflare(),
    tanstackRouter({
      autoCodeSplitting: true,
      generatedRouteTree: "routeTree.gen.ts",
      routesDirectory: "routes",
      target: "react",
    }),
    tsconfigPaths({
      projects: ["tsconfig.json"],
    }),
    react({
      babel: {
        plugins: ["babel-plugin-react-compiler"],
      },
    }),
    tailwind(),
  ],
  resolve: {
    alias: {
      "@/migrations": "virtual:chat-migrations",
      "@": fileURLToPath(new URL(".", import.meta.url)),
    },
    dedupe: ["react", "react-dom", "effect", "@crosshatch/util", "crosshatch"],
  },
  server: {
    allowedHosts: [".localhost"],
    fs: { strict: false },
    host: "127.0.0.1",
    port: 7779,
    strictPort: true,
  },
  worker: {
    format: "es",
    plugins: () => [migrations()],
  },
})
