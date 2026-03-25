import { cloudflare } from "@cloudflare/vite-plugin"
import tailwind from "@tailwindcss/vite"
import { tanstackRouter } from "@tanstack/router-plugin/vite"
import react from "@vitejs/plugin-react"
import { fileURLToPath, URL } from "node:url"
import { defineConfig } from "vite"
import mkcert from "vite-plugin-mkcert"
import tsconfigPaths from "vite-tsconfig-paths"

import migrations from "./plugin.ts"

// proxy: {
//   "/v1/traces": {
//     target: "http://localhost:4318",
//     changeOrigin: true,
//     secure: false,
//   },
// },

export default defineConfig({
  envDir: "../../..",
  optimizeDeps: {
    exclude: [
      "@effect/platform",
      "@electric-sql/pglite",
      "@electric-sql/pglite/contrib/uuid_ossp",
      "@electric-sql/pglite/contrib/fuzzystrmatch",
      "@electric-sql/pglite/contrib/lo",
      "@electric-sql/pglite/contrib/vector",
      "@electric-sql/pglite/live",
      "@electric-sql/pglite/worker",
      "tiktoken/lite",
    ],
    include: ["@effect-atom/atom", "@effect-atom/atom-react"],
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
    mkcert({
      hosts: ["local.crosshatch.chat"],
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
    dedupe: [
      "react",
      "react-dom",
      "effect",
      "@effect-atom/atom",
      "@effect-atom/atom-react",
      "@crosshatch/util",
      "crosshatch",
    ],
  },
  server: {
    allowedHosts: ["local.crosshatch.chat", "local.crosshatch.dev"],
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
