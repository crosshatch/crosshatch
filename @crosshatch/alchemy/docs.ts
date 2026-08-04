import * as Alchemy from "alchemy"
import * as Cloudflare from "alchemy/Cloudflare"
import { Effect } from "effect"

import { PrPreviewComment } from "./PrComment.ts"
import { WorkerConfig } from "./WorkerConfig.ts"

export const docs = Effect.fnUntraced(function* ({
  domain,
  devPort,
}: {
  readonly domain: string
  readonly devPort: number
}) {
  const base = yield* WorkerConfig({ domain })
  const CHX_INTERNAL_STAGE = yield* Alchemy.Stage
  const { url } = yield* Cloudflare.Website.StaticSite("Docs", {
    ...base,
    dev: { command: `pnpm exec vocs dev --host 127.0.0.1 --port ${devPort}` },
    command: "pnpm exec vocs build",
    outdir: "dist/public",
    env: {
      CHX_INTERNAL_STAGE,
      VITE_PUBLIC_CHX_INTERNAL_STAGE: CHX_INTERNAL_STAGE,
      CLOUDFLARE: 1,
    },
    assets: {
      notFoundHandling: "404-page",
    },
  })
  yield* PrPreviewComment({ name: "Docs", url })
  return { url }
})
