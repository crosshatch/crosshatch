import { Required, Payer, Facilitator, Accepts } from "crosshatch"
import { Address } from "crosshatch/Cryptocurrency"
import { Eip155 } from "crosshatch/Cryptocurrency/Eip155"
import { Solana } from "crosshatch/Cryptocurrency/Solana"
import { USDC } from "crosshatch/Cryptocurrency/token-deployments"
import { Config, Effect, Console, Layer } from "effect"
import { FetchHttpClient } from "effect/unstable/http"

const amount = ""

Effect.gen(function* () {
  const recipients = yield* Config.all({
    eip155: Address.fromConfig(Eip155, "EIP155_RECIPIENT"),
    solana: Address.fromConfig(Solana, "SOLANA_RECIPIENT"),
  })

  const accepts = Accepts.empty.pipe(
    Accepts.add(USDC.base_mainnet, { amount, recipients }),
    Accepts.add(USDC, { amount, recipients }),
    Accepts.add(USDC, { amount, recipients }),
  )

  const required = yield* Required.describe`
  |
  | Description of the charge.
  |
  `(accepts)

  const payload = yield* Payer.make(required)

  const settlement = yield* Facilitator.settle(payload)

  yield* Console.log(settlement)
}).pipe(
  Effect.provide([
    Facilitator.layerFromConfig("FACILITATOR_URL").pipe(Layer.provide(FetchHttpClient.layer)),
    Payer.layer,
  ]),
  Effect.runFork,
)
