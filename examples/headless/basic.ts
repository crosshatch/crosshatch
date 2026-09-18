import { Required, Payer, Facilitator, Accepts } from "crosshatch"
import { Address } from "crosshatch/Cryptocurrency"
import { Eip155 } from "crosshatch/Cryptocurrency/Eip155"
import { Solana } from "crosshatch/Cryptocurrency/Solana"
import { USDC, EURT, DAI } from "crosshatch/Cryptocurrency/tokens"
import { Config, Effect, Console, Layer } from "effect"
import { FetchHttpClient } from "effect/unstable/http"

const amount = ""

Effect.gen(function* () {
  const recipients = yield* Config.all({
    eip155: Address.fromConfig(Eip155, "EIP155_RECIPIENT"),
    solana: Address.fromConfig(Solana, "SOLANA_RECIPIENT"),
  })

  const accepts = Accepts.empty.pipe(
    Accepts.add(EURT, { amount, recipients }),
    Accepts.add(DAI, { amount, recipients }),
    Accepts.addInstrument(USDC.zk_sync_mainnet, { amount, recipients }),
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
