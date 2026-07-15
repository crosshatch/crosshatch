import { KnownAssets, Facilitator, Required, Requirements, Payload } from "crosshatch"
import { BrowserPayer } from "crosshatch/Browser"
import { Eip155Address } from "crosshatch/Eip155"
import { Config, Effect } from "effect"

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
  yield* Facilitator.settle({ payload })
}).pipe(Effect.provide(BrowserPayer.layer), Effect.runFork)
