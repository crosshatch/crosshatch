import { getAddressFromPublicKey, isAddress } from "@solana/addresses"
import { Effect, Schema as S } from "effect"

import * as Address from "../Address.ts"
import { Ed25519Pair } from "../Crypto/Crypto.ts"
import type * as Mnemonic from "../Mnemonic.ts"
import { brand, SOLANA_DERIVATION_PATH } from "./_common.ts"

export const SolanaAddress = S.String.check(
  S.isPattern(/^[1-9A-HJ-NP-Za-km-z]{32,44}$/u),
  S.makeFilter((value) => (isAddress(value) ? undefined : "Expected a 32-byte Base58 Solana address")),
).pipe(Address.brand, brand)

export const fromPublicKey = (publicKey: CryptoKey) =>
  Effect.promise(() => getAddressFromPublicKey(publicKey)).pipe(
    Effect.map((value) => SolanaAddress.make(value, { disableChecks: true })),
  )

export const fromMnemonic = (
  mnemonic: Mnemonic.Mnemonic,
): Effect.Effect<typeof SolanaAddress.Type, S.SchemaError, never> =>
  Ed25519Pair.fromMnemonic(mnemonic, SOLANA_DERIVATION_PATH).pipe(
    Effect.flatMap(({ publicKey }) => fromPublicKey(publicKey)),
  )
