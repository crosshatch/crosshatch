import store from "@crosshatch/store/plugin"
import tailwind from "@tailwindcss/vite"
import { tanstackRouter } from "@tanstack/router-plugin/vite"
import react from "@vitejs/plugin-react"
import { fileURLToPath, URL } from "node:url"
import { defineConfig } from "vite"
import mkcert from "vite-plugin-mkcert"
import tsconfigPaths from "vite-tsconfig-paths"

// proxy: {
//   "/v1/traces": {
//     target: "http://localhost:4318",
//     changeOrigin: true,
//     secure: false,
//   },
// },

export default defineConfig({
  envDir: "../../..",
  server: {
    host: "127.0.0.1",
    port: 7779,
    strictPort: true,
    allowedHosts: ["local.crosshatch.chat", "local.crosshatch.dev"],
    fs: { strict: false },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL(".", import.meta.url)),
    },
  },
  worker: { format: "es" },
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
      "@huggingface/transformers",
      "tiktoken/lite",
    ],
  },
  plugins: [
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
      routesDirectory: "routes",
      generatedRouteTree: "routeTree.gen.ts",
    }),
    tsconfigPaths({
      projects: ["tsconfig.json"],
    }),
    store(),
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
})
