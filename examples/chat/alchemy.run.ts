import Alchemy from "alchemy"
import { Vite } from "alchemy/cloudflare"
import { Exec } from "alchemy/os"

const app = await Alchemy("crosshatch-chat", {
  adopt: true,
})

await Exec("generate-migration", {
  command: "pnpm generate",
})

export const worker = await Vite("crosshatch.chat", {
  spa: true,
  bindings: {
    ...!app.local && {
      DEV: Alchemy.env("DEV", "false"),
    },
  },
  domains: ["crosshatch.chat"],
})

await app.finalize()
