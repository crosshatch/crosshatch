import tailwind from "@tailwindcss/vite"
import { tanstackRouter } from "@tanstack/router-plugin/vite"
import react from "@vitejs/plugin-react"
import { fileURLToPath, URL } from "node:url"
import { type PluginOption, type UserConfig } from "vite"
import mkcert from "vite-plugin-mkcert"

export const router = tanstackRouter({
  target: "react",
  autoCodeSplitting: true,
  routesDirectory: "routes",
  generatedRouteTree: "routeTree.gen.ts",
})

export const make = ({ origin, port, url, allow, envDir }: {
  envDir: string
  origin?: string | undefined
  allow?: Array<string> | undefined
  port: number
  url: string
}): {
  root: UserConfig
  plugins: Array<PluginOption>
} => ({
  root: {
    envDir,
    server: {
      host: "127.0.0.1",
      port,
      strictPort: true,
      allowedHosts: [...origin ? [origin] : [], ...allow ?? []],
      proxy: {
        "/v1/traces": {
          target: "http://localhost:4318",
          changeOrigin: true,
          secure: false,
        },
      },
      fs: { strict: false },
    },
    resolve: {
      alias: { "@": fileURLToPath(new URL(".", url)) },
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
        "tiktoken/lite",
      ],
    },
  },
  plugins: [
    ...origin ? [mkcert({ hosts: [origin] })] : [],
    react({
      babel: {
        plugins: ["babel-plugin-react-compiler"],
      },
    }),
    tailwind(),
  ],
})
