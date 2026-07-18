import { KnownAssets, Required, Requirements, Payload, Facilitator } from "crosshatch"
import { Eip155Address } from "crosshatch/Eip155"
import { Config, Effect, Layer, Console } from "effect"
import { FetchHttpClient } from "effect/unstable/http"

import { PayerLive } from "./PayerLive.ts"

Effect.gen(function* () {
  const recipient = yield* Config.schema(Eip155Address.Eip155Address, "PAY_TO_EIP155")
  const required = yield* Required.make`
  |
  | Description of the charge.
  |
  `.pipe(
    Required.accept(
      Requirements.denomination(KnownAssets.Usd, {
        amount: 0.01,
        recipients: { eip155: { 8453: recipient } },
        ttl: "1 minutes",
      }),
    ),
  )
  const { payload } = yield* Payload.make({ required })
  const settlement = yield* Facilitator.settle({ payload })
  yield* Console.log(settlement)
}).pipe(
  Effect.provide([Facilitator.layer().pipe(Layer.provide(FetchHttpClient.layer)), PayerLive]),
  Effect.onError(Effect.logError),
  Effect.runFork,
)
