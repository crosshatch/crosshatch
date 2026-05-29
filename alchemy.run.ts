import * as Alchemy from "alchemy"
import * as Cloudflare from "alchemy/Cloudflare"
import * as Effect from "effect/Effect"

import { CrosshatchDocs } from "./docs/alchemy.run.ts"

export default Alchemy.Stack(
  "crosshatch-kit",
  {
    providers: Cloudflare.providers(),
    state: Cloudflare.state(),
  },
  Effect.gen(function* () {
    const docs = yield* CrosshatchDocs

    return {
      docsUrl: docs.url,
      docsDomains: docs.domains,
    }
  }),
)
