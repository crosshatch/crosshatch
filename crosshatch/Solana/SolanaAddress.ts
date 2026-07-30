import { getAddressFromPublicKey } from "@solana/addresses"
import { Effect, Schema as S } from "effect"

import { Ed25519Pair, Slip10 } from "../Crypto/Crypto.ts"
import { Address, Mnemonic } from "../index.ts"
import { brand } from "./_common.ts"

export type SolanaAddress = typeof SolanaAddress.Type
export const SolanaAddress = S.String.check(S.isPattern(/^[1-9A-HJ-NP-Za-km-z]{32,44}$/u)).pipe(Address.brand, brand)

export const fromPublicKey = (publicKey: CryptoKey) =>
  Effect.promise(() => getAddressFromPublicKey(publicKey)).pipe(
    Effect.map((value) => SolanaAddress.make(value, { disableChecks: true })),
  )

export const fromMnemonic = (mnemonic: Mnemonic.Mnemonic): Effect.Effect<SolanaAddress, S.SchemaError> =>
  Slip10.derive(Mnemonic.toSeed(mnemonic), [44, 501, 0, 0]).pipe(
    Effect.flatMap(({ privateKeySeed }) => Ed25519Pair.fromSeed(privateKeySeed)),
    Effect.flatMap(({ publicKey }) => fromPublicKey(publicKey)),
  )
