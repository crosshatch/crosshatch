import { Effect, flow, Option, Schema as S } from "effect"

import * as Base58 from "../../Crypto/Base58.ts"
import * as CryptoKey from "../../Crypto/CryptoKey.ts"
import * as Ed25519Point from "../../Crypto/Ed25519Point.ts"
import * as Hash from "../../Crypto/Hash.ts"
import { ensure, SvmProtocolError } from "./Error.ts"

const PDA_MARKER = new TextEncoder().encode("ProgramDerivedAddress")

export const Address = S.String.check(
  S.makeFilter(
    (value) => Option.match(Base58.decode(value), { onNone: () => false, onSome: (bytes) => bytes.byteLength === 32 }),
    { expected: "a Base58-encoded 32-byte Solana address" },
  ),
).pipe(S.brand("crosshatch/SvmAddress"))
export type Address = typeof Address.Type

export const Blockhash = Address.pipe(S.brand("crosshatch/Blockhash"))
export type Blockhash = typeof Blockhash.Type

const fromBytes = (bytes: Uint8Array) =>
  bytes.byteLength === 32
    ? Effect.succeed(Address.make(Base58.encode(bytes)))
    : Effect.fail(new SvmProtocolError({ message: `Solana address requires 32 bytes; got ${bytes.byteLength}` }))

export const toBytes = flow(Base58.decode, Option.getOrThrow)
export const fromPublicKey = flow(CryptoKey.toBytes, Effect.flatMap(fromBytes))

const createProgramAddress = Effect.fnUntraced(function* (
  programAddress: Address,
  seeds: ReadonlyArray<Uint8Array>,
): Effect.fn.Return<Option.Option<Address>, SvmProtocolError, never> {
  yield* ensure(seeds.length <= 16, "A PDA supports at most 16 seeds")
  for (const [index, seed] of seeds.entries()) {
    yield* ensure(seed.byteLength <= 32, `PDA seed ${index} exceeds 32 bytes`)
  }
  const input = new Uint8Array(seeds.reduce((total, seed) => total + seed.byteLength, 0) + 32 + PDA_MARKER.length)
  let offset = 0
  for (const seed of seeds) {
    input.set(seed, offset)
    offset += seed.length
  }
  input.set(toBytes(programAddress), offset)
  input.set(PDA_MARKER, offset + 32)
  const digest = yield* Hash.sha256(input)
  if (Ed25519Point.isOnCurve(digest)) {
    return Option.none<Address>()
  }
  return Option.some(yield* fromBytes(digest))
})

export const findProgramDerivedAddress = Effect.fnUntraced(function* (
  programAddress: Address,
  seeds: ReadonlyArray<Uint8Array>,
): Effect.fn.Return<readonly [Address, number], SvmProtocolError> {
  for (let bump = 255; bump > 0; bump--) {
    const candidate = yield* createProgramAddress(programAddress, [...seeds, Uint8Array.of(bump)])
    if (candidate._tag === "Some") {
      return [candidate.value, bump] as const
    }
  }
  return yield* new SvmProtocolError({ message: "Unable to find a viable PDA bump" })
})
