import { handler } from "@crosshatch/util"
import { Effect } from "effect"

import { FacilitatorApi } from "../FacilitatorApi/index.ts"

export const supported = handler(FacilitatorApi, "facilitator", "supported", () =>
  Effect.succeed({
    kinds: [],
    extensions: [],
    signers: {
      "eip155:*": ["0x0000000000000000000000000000000000000001"],
      "solana:*": ["11111111111111111111111111111111"],
    },
  }),
)
