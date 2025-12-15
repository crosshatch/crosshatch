import { make, router } from "@crosshatch/config/vite"
import { defineConfig } from "vite"

const { root, plugins } = make({
  origin: "chat.crosshatch.local",
  allow: ["app.crosshatch.local"],
  port: 7779,
  url: import.meta.url,
  envDir: "..",
})

export default defineConfig({
  ...root,
  plugins: [router, ...plugins],
})
