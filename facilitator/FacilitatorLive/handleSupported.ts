import { supportedX402PaymentKinds } from "@distilled.cloud/coinbase"
import { ChainId } from "crosshatch/Ca"
import { FacilitatorApi } from "crosshatch/X402"
import { Effect, Schema as S } from "effect"

import { handler } from "./_common.ts"

export const handleSupported = handler(FacilitatorApi, "facilitator", "supported", () =>
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
