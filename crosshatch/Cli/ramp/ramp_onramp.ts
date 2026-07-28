import { Console, Effect, Option, Schema as S } from "effect"
import { Command, Flag } from "effect/unstable/cli"

import { ChainId } from "../../ChainId.ts"
import { fromMnemonic } from "../../Eip155/Eip155Address.ts"
import * as HostMnemonic from "../../Host/HostMnemonic.ts"
import * as Mnemonic from "../../Mnemonic.ts"
import { CaAccountId } from "../../Ramp/CaAccountId.ts"
import * as Ramp from "../../Ramp/onramp.ts"
import { Providers } from "../../Ramp/RampApi.ts"

export const onramp = Command.make("onramp", {
  mnemonic: Flag.string("mnemonic").pipe(
    Flag.withDescription("Stored mnemonic name"),
    Flag.optional,
    Flag.map(Option.getOrUndefined),
  ),
  chain: Flag.string("chain").pipe(
    Flag.withDescription("CAIP-2 chain ID used with a stored mnemonic"),
    Flag.optional,
    Flag.map(Option.getOrUndefined),
  ),
  amount: Flag.integer("amount").pipe(Flag.withDescription("Positive integer fiat amount")),
  provider: Flag.choice("provider", Providers).pipe(Flag.withDefault("Coinbase")),
}).pipe(
  Command.withDescription("Create an onramp URL for a stored mnemonic"),
  Command.withHandler(
    Effect.fn(
      function* ({ amount, chain, provider }) {
        const chainId =
          chain === undefined
            ? ChainId.make("eip155:8453", { disableChecks: true })
            : yield* S.decodeUnknownEffect(ChainId)(chain)
        const mnemonic = yield* Mnemonic.Mnemonic
        const address = fromMnemonic(mnemonic)
        const accountId = yield* S.decodeUnknownEffect(CaAccountId)(`${chainId}:${address}`)
        const { onrampUrl } = yield* Ramp.onramp({ amount, provider, recipient: accountId })
        yield* Console.log(onrampUrl)
      },
      (effect, { mnemonic }) => Effect.provide(effect, HostMnemonic.layer(mnemonic)),
    ),
  ),
)
