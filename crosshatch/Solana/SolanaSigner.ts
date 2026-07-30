import { address as makeSolanaKitAddress } from "@solana/addresses"
import type { TransactionPartialSigner } from "@solana/kit"
import { partiallySignTransaction } from "@solana/transactions"
import { Context, Effect, Layer } from "effect"

import { Ed25519Pair, Slip10 } from "../Crypto/Crypto.ts"
import * as Mnemonic from "../Mnemonic.ts"
import * as SolanaAddress from "./SolanaAddress.ts"

export class SolanaSigner extends Context.Service<SolanaSigner, TransactionPartialSigner>()(
  "crosshatch/Solana/SolanaSigner",
) {}

export const layerFromMnemonic = Layer.effect(
  SolanaSigner,
  Effect.gen(function* () {
    const mnemonic = yield* Mnemonic.Mnemonic
    const keypair = yield* Slip10.derive(Mnemonic.toSeed(mnemonic), [44, 501, 0, 0]).pipe(
      Effect.flatMap(({ privateKeySeed }) => Ed25519Pair.fromSeed(privateKeySeed)),
    )
    const address = yield* SolanaAddress.fromPublicKey(keypair.publicKey).pipe(Effect.map(makeSolanaKitAddress))
    const signTransactions: TransactionPartialSigner["signTransactions"] = (transactions) =>
      Promise.all(
        transactions.map(async (transaction) => {
          const { signatures } = await partiallySignTransaction([keypair], transaction)
          return { [address]: signatures[address]! }
        }),
      )
    return { address, signTransactions }
  }),
)
