import { address as makeSolanaKitAddress } from "@solana/addresses"
import type { MessagePartialSigner, SignatureBytes, TransactionPartialSigner } from "@solana/kit"
import { partiallySignTransaction } from "@solana/transactions"
import { Context, Effect, Layer } from "effect"

import { Ed25519Pair } from "../Crypto/Crypto.ts"
import * as Mnemonic from "../Mnemonic.ts"
import { SOLANA_DERIVATION_PATH } from "./_common.ts"
import * as SolanaAddress from "./SolanaAddress.ts"

export class SolanaSigner extends Context.Service<SolanaSigner, TransactionPartialSigner & MessagePartialSigner>()(
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
    const signMessages: MessagePartialSigner["signMessages"] = (messages) =>
      Promise.all(
        messages.map(async (message) => ({
          [address]: new Uint8Array(
            await crypto.subtle.sign({ name: "Ed25519" }, keypair.privateKey, message.content.slice()),
          ) as SignatureBytes,
        })),
      )
    return { address, signTransactions, signMessages }
  }),
)
