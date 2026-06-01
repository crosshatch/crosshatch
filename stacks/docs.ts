import * as Alchemy from "alchemy"
import * as Cloudflare from "alchemy/Cloudflare"
import { workerCommon } from "liminal-util/alchemy/workerCommon"

export default Alchemy.Stack(
  "crosshatch-docs",
  {
    providers: Cloudflare.providers(),
    state: Cloudflare.state(),
  },
  Cloudflare.StaticSite("Docs", {
    ...workerCommon,
    cwd: "docs",
    command: "pnpm build",
    outdir: "dist",
    main: "docs/main.ts",
    assetsConfig: { notFoundHandling: "single-page-application" },
    domain: ["docs.crosshatch.dev", "www.docs.crosshatch.dev"],
  }),
)
