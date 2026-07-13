import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { vocs } from "vocs/vite"

export default defineConfig({
  plugins: [
    react(),
    vocs(),
    {
      name: "crosshatch:waku-build-metadata-upload",
      generateBundle() {
        if (this.environment.name !== "rsc") return
        this.emitFile({
          type: "asset",
          fileName: "__waku_build_metadata.js",
          source: "export const buildMetadata = new Map();\n",
        })
      },
    },
  ],
})
