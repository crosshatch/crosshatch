import { browse } from "@crosshatch/widget"
import { Effect, flow, Schema as S, Struct } from "effect"
import { Command, Flag } from "effect/unstable/cli"

import { AccountId } from "../../AccountId.ts"
import * as Amount from "../../Amount.ts"
import { Providers, CirqueClient } from "../../Cirque/Cirque.ts"
import { Eip155Address } from "../../Eip155/Eip155.ts"
import { MnemonicStore } from "../../index.ts"
import * as Mnemonic from "../../Mnemonic.ts"
import { Reference } from "../../Reference.ts"

export const onramp = Command.make("onramp", {
  mnemonic: Flag.string("mnemonic").pipe(Flag.withDefault(undefined), Flag.withDescription("Stored mnemonic name")),
  chain: Flag.string("chain").pipe(
    Flag.withDefault(undefined),
    Flag.withDescription("EIP-155 chain reference (e.g., 8453 for Base)"),
  ),
  amount: Flag.integer("amount").pipe(Flag.withDescription("Positive integer fiat amount")),
  provider: Flag.choice("provider", Providers).pipe(Flag.withDefault("Coinbase")),
}).pipe(
  Command.withDescription("Create an onramp URL for a stored mnemonic"),
  Command.withHandler(
    Effect.fn(
      function* ({ amount, chain, provider }) {
        const chainRef = chain === undefined ? Reference.make("8453") : yield* S.decodeUnknownEffect(Reference)(chain)
        const mnemonic = yield* Mnemonic.Mnemonic
        const address = yield* Eip155Address.fromMnemonic(mnemonic)
        const ramp = yield* CirqueClient.CirqueClient
        const recipient = AccountId.make(`eip155:${chainRef}:${address}`, { disableChecks: true })
        yield* ramp.ramp
          .onramp({
            payload: {
              provider,
              amount: yield* Amount.from(amount),
              recipient,
            },
          })
          .pipe(Effect.flatMap(flow(Struct.get("onrampUrl"), browse)))
      },
      (effect, { mnemonic }) => Effect.provide(effect, MnemonicStore.layerMnemonicFromName(mnemonic)),
    ),
  ),
)
