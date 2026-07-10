import { KnownAssets, Facilitator, Required, Requirements, Payload } from "crosshatch"
import { BrowserPayer } from "crosshatch/Browser"
import { Eip155Address } from "crosshatch/Eip155"
import { Config, Effect } from "effect"

Effect.gen(function* () {
  const PAY_TO_EIP155 = yield* Config.schema(Eip155Address.Eip155Address, "PAY_TO_EIP155")
  const required = yield* Required.make`
  |
  | Description of the charge.
  |
  `.pipe(
    Required.accept(
      Requirements.asset(KnownAssets.USDC, {
        amount: 0.01,
        recipients: { eip155: { 8453: PAY_TO_EIP155 } },
        ttl: "1 minutes",
      }),
    ),
  )
  const { payload } = yield* Payload.make({ required })
  yield* Facilitator.settle({ payload })
}).pipe(Effect.provide(BrowserPayer.layer), Effect.runFork)
