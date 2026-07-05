import { supportedX402PaymentKinds } from "@distilled.cloud/coinbase"
import { ChainId, Facilitator } from "crosshatch"
import { Effect, Schema as S } from "effect"

import { handler } from "./_common.ts"

export const handleSupported = handler(Facilitator.FacilitatorApi, "facilitator", "supported", () =>
  supportedX402PaymentKinds({}).pipe(
    Effect.flatMap(({ kinds, ...rest }) =>
      Effect.forEach(
        kinds,
        Effect.fn(function* (kind) {
          const { x402Version, ...rest } = kind
          const { network, ...rest2 } = rest
          return yield* S.decodeUnknownEffect(ChainId.ChainId)(network).pipe(
            Effect.map((network) => ({
              x402Version: 2 as const,
              network,
              ...rest2,
            })),
          )
        }),
        { concurrency: "unbounded" },
      ).pipe(Effect.map((kinds) => ({ kinds, ...rest }))),
    ),
    Effect.orDie,
  ),
)
