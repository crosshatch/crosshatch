import { supportedX402PaymentKinds } from "@distilled.cloud/coinbase"
import { ChainId, Facilitator } from "crosshatch"
import { Effect, Schema as S } from "effect"

import { handler } from "./_common.ts"

export const handleSupported = handler(Facilitator.FacilitatorApi, "facilitator", "supported", () =>
  supportedX402PaymentKinds({}).pipe(
    Effect.flatMap(({ kinds, ...rest }) =>
      Effect.forEach(
        kinds,
        ({ network, ...rest }) =>
          S.decodeUnknownEffect(ChainId.ChainId)(network).pipe(Effect.map((network) => ({ network, ...rest }))),
        { concurrency: "unbounded" },
      ).pipe(Effect.map((kinds) => ({ kinds, ...rest }))),
    ),
    Effect.orDie,
  ),
)
