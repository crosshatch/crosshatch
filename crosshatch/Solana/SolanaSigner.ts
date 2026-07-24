import { Context, Effect, Layer } from "effect"

import { Ed25519Pair, Slip10 } from "../Crypto/Crypto.ts"
import * as Mnemonic from "../Mnemonic.ts"
import { SvmProtocolError, type Transaction, partiallySignTransaction } from "./Protocol/Protocol.ts"
import * as SolanaAddress from "./SolanaAddress.ts"

export class SolanaSigner extends Context.Service<
  SolanaSigner,
  {
    readonly address: typeof SolanaAddress.SolanaAddress.Type
    readonly signTransaction: (transaction: Transaction) => Effect.Effect<Transaction, SvmProtocolError>
  }
>()("crosshatch/Solana/SolanaSigner") {}

export const layerMnemonic = Layer.effect(
  SolanaSigner,
  Effect.gen(function* () {
    const mnemonic = yield* Mnemonic.Mnemonic
    const keyPair = yield* Slip10.derive(Mnemonic.toSeed(mnemonic), [44, 501, 0, 0]).pipe(
      Effect.flatMap(({ privateKeySeed }) => Ed25519Pair.fromSeed(privateKeySeed)),
    )
    const address = yield* SolanaAddress.fromPublicKey(keyPair.publicKey)
    return {
      address,
      signTransaction: (transaction) => partiallySignTransaction([keyPair], transaction),
    }
  }),
)
