import { defineConfig } from "vite"

export default defineConfig({
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
})
