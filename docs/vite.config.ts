import { make } from "@crosshatch/config/vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import mdx from "fumadocs-mdx/vite"
import { defineConfig } from "vite"

const { root, plugins } = make({
  origin: "local.docs.crosshatch.dev",
  allow: ["local.docs.crosshatch.dev"],
  port: 7778,
  url: import.meta.url,
  envDir: "..",
})

export default defineConfig({
  ...root,
  plugins: [
    mdx(await import("./source.config")),
    tanstackStart({
      prerender: {
        enabled: true,
      },
      srcDirectory: ".",
    }),
    ...plugins,
  ],
})
