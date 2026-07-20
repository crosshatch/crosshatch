import { address as makeSolanaKitAddress } from "@solana/addresses"
import type { TransactionPartialSigner } from "@solana/kit"
import { partiallySignTransaction } from "@solana/transactions"
import { Context, Effect, Layer } from "effect"

import { Ed25519Pair } from "../Crypto/Crypto.ts"
import * as Mnemonic from "../Mnemonic.ts"
import { SOLANA_DERIVATION_PATH } from "./_common.ts"
import * as SolanaAddress from "./SolanaAddress.ts"

export class SolanaSigner extends Context.Service<SolanaSigner, TransactionPartialSigner>()(
  "crosshatch/Solana/SolanaSigner",
) {}

export const layerMnemonic = Layer.effect(
  SolanaSigner,
  Effect.gen(function* () {
    const mnemonic = yield* Mnemonic.Mnemonic
    const keypair = yield* Ed25519Pair.fromMnemonic(mnemonic, SOLANA_DERIVATION_PATH)
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
