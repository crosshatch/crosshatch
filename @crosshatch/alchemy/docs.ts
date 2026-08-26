import * as Alchemy from "alchemy"
import * as Cloudflare from "alchemy/Cloudflare"
import { Effect } from "effect"

import { config } from "./ChxWorker.ts"
import { PrPreviewComment } from "./PrComment.ts"

export const docs = Effect.fnUntraced(function* ({ domain, port }: { readonly domain: string; readonly port: number }) {
  const base = yield* config({ domain, port })
  const CHX_INTERNAL_STAGE = yield* Alchemy.Stage
  const { url } = yield* Cloudflare.Website.Vocs("Docs", {
    ...base,
    env: {
      CHX_INTERNAL_STAGE,
      VITE_PUBLIC_CHX_INTERNAL_STAGE: CHX_INTERNAL_STAGE,
      CLOUDFLARE: 1,
    },
  })
  yield* PrPreviewComment({ name: "Docs", url })
  return { url }
})
