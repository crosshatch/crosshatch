import { Credentials, DEFAULT_API_BASE_URL } from "@distilled.cloud/coinbase"
import { Layer, Effect } from "effect"

import { FacilitatorEnv } from "./FacilitatorEnv.ts"

export const layer = FacilitatorEnv.pipe(
  Effect.map(({ CDP_API_KEY_ID, CDP_API_KEY_SECRET }) =>
    Layer.succeed(
      Credentials,
      Effect.succeed({
        apiBaseUrl: DEFAULT_API_BASE_URL,
        apiKeyId: CDP_API_KEY_ID,
        apiKeySecret: CDP_API_KEY_SECRET,
      }),
    ),
  ),
  Layer.unwrap,
)
