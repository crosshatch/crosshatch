import { BrowserLauncher } from "@crosshatch/widget"
import { Effect, Schema as S } from "effect"
import { Command, Flag } from "effect/unstable/cli"

import * as Amount from "../../Amount.ts"
import { CirqueClient } from "../../Cirque/index.ts"
import { Account, MnemonicStore, Mnemonic, Reference, Chain, Namespace, Address } from "../../index.ts"
import { Eip155Address } from "../../namespaces/Eip155/index.ts"

export const onramp = Command.make("onramp", {
  mnemonic: Flag.string("mnemonic").pipe(Flag.withDefault(undefined), Flag.withDescription("Stored mnemonic name")),
  chain: Flag.string("chain").pipe(
    Flag.withDefault(undefined),
    Flag.withDescription("EIP-155 chain reference (e.g., 8453 for Base)"),
  ),
  amount: Flag.string("amount").pipe(
    Flag.withSchema(
      S.String.check(S.isPattern(/^\+?0*[1-9]\d*$/u, { message: "Expected a positive integer fiat amount" })),
    ),
    Flag.withDescription("Positive integer fiat amount"),
  ),
  provider: Flag.choice("provider", ["Coinbase"] /* TODO: use `Providers` from `Cirque` */).pipe(
    Flag.withDefault("Coinbase"),
  ),
}).pipe(
  Command.withDescription("Create an onramp URL for a stored mnemonic"),
  Command.withHandler(
    Effect.fn(
      function* ({ amount, chain }) {
        const reference =
          chain === undefined
            ? Reference.ReferenceString.make("8453")
            : yield* S.decodeEffect(Reference.ReferenceString)(chain)
        const mnemonic = yield* Mnemonic.Mnemonic
        const address = yield* Eip155Address.fromMnemonic(mnemonic)
        Account.make({
          chain: yield* S.decodeEffect(Chain.Chain)({
            namespace: "eip155",
            reference,
          }),
          address,
        })
        const recipient = Account.make(`eip155:${reference}:${address}`, { disableChecks: true })
        const cirque = yield* CirqueClient.CirqueClient
        yield* cirque.ramp
          .onramp({
            payload: {
              provider: "Coinbase",
              amount: yield* Amount.fromString(amount),
              recipient,
            },
          })
          .pipe(
            Effect.map((v) => v.url),
            Effect.flatMap(BrowserLauncher.open),
          )
      },
      (effect, { mnemonic }) => Effect.provide(effect, MnemonicStore.layerMnemonicFromName(mnemonic)),
    ),
  ),
)
