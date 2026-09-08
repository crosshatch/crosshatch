import { getAddressFromPublicKey } from "@solana/addresses"
import { Effect, type Schema as S } from "effect"

import { Ed25519Pair, Slip10 } from "../../Crypto/index.ts"
import { Address, Mnemonic } from "../../index.ts"
import { Solana } from "./Solana.ts"

export const fromPublicKey = (publicKey: CryptoKey) =>
  Effect.promise(() => getAddressFromPublicKey(publicKey)).pipe(Effect.flatMap((value) => Address.make(value, Solana)))

export const fromMnemonic = (mnemonic: Mnemonic.Mnemonic): Effect.Effect<Address.Address<Solana>, S.SchemaError> =>
  Slip10.derive(Mnemonic.toSeed(mnemonic), [44, 501, 0, 0]).pipe(
    Effect.flatMap(({ privateKeySeed }) => Ed25519Pair.fromSeed(privateKeySeed)),
    Effect.flatMap(({ publicKey }) => fromPublicKey(publicKey)),
  )
