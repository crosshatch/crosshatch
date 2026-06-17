import { ChainIdString } from "@crosshatch/caip"
import { handler } from "@crosshatch/util/httpapi"
import { FacilitatorApi } from "@crosshatch/x402"
import { supportedX402PaymentKinds } from "@distilled.cloud/coinbase"
import { Effect, Schema as S } from "effect"

export const handleSupported = handler(FacilitatorApi, "facilitator", "supported", () =>
  supportedX402PaymentKinds({}).pipe(
    Effect.flatMap(({ kinds, ...rest }) =>
      Effect.forEach(
        kinds,
        ({ network, ...rest }) =>
          S.decodeUnknownEffect(ChainIdString)(network).pipe(Effect.map((network) => ({ network, ...rest }))),
        { concurrency: "unbounded" },
      ).pipe(Effect.map((kinds) => ({ kinds, ...rest }))),
    ),
    Effect.orDie,
  ),
)
