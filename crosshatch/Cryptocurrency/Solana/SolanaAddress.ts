import { getAddressFromPublicKey } from "@solana/addresses"
import { Effect, Schema as S } from "effect"

import { Ed25519Pair, Slip10 } from "../../Crypto/index.ts"
import { type Address, Mnemonic } from "../index.ts"
import { Solana } from "./Solana.ts"

export const fromPublicKey = (publicKey: CryptoKey) =>
  Effect.promise(() => getAddressFromPublicKey(publicKey)).pipe(Effect.flatMap(S.decodeEffect(Solana.Address)))

export const fromMnemonic = (mnemonic: Mnemonic.Mnemonic): Effect.Effect<Address.Address, S.SchemaError> =>
  Slip10.derive(Mnemonic.toSeed(mnemonic), [44, 501, 0, 0]).pipe(
    Effect.flatMap((v) => Ed25519Pair.fromSeed(v.privateKeySeed)),
    Effect.flatMap((v) => fromPublicKey(v.publicKey)),
  )
