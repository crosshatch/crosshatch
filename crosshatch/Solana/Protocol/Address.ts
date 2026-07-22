/* oxlint-disable no-bitwise -- byte-level codec */
import { Effect, Option, Schema as S, Data } from "effect"

import * as CryptoKey from "../../Crypto/CryptoKey.ts"
import { compressedPointIsOnCurve } from "./Curve.ts"

export class SvmProtocolError extends Data.TaggedError("SvmProtocolError")<{
  readonly message: string
  readonly cause?: unknown
}> {}

const ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
const ALPHABET_INDEX = new Map(Array.from(ALPHABET, (character, index) => [character, BigInt(index)]))
const PDA_MARKER = new TextEncoder().encode("ProgramDerivedAddress")

export const base58Encode = (bytes: Uint8Array): string => {
  let integer = 0n
  for (const byte of bytes) integer = (integer << 8n) | BigInt(byte)

  let encoded = ""
  while (integer > 0n) {
    encoded = ALPHABET[Number(integer % 58n)]! + encoded
    integer /= 58n
  }
  let leadingZeroes = 0
  while (leadingZeroes < bytes.length && bytes[leadingZeroes] === 0) leadingZeroes++
  return "1".repeat(leadingZeroes) + encoded
}

export const base58Decode = (value: string): Option.Option<Uint8Array> => {
  let integer = 0n
  for (const character of value) {
    const digit = ALPHABET_INDEX.get(character)
    if (digit === undefined) return Option.none()
    integer = integer * 58n + digit
  }

  const body: number[] = []
  while (integer > 0n) {
    body.push(Number(integer & 0xffn))
    integer >>= 8n
  }
  body.reverse()
  let leadingZeroes = 0
  while (leadingZeroes < value.length && value[leadingZeroes] === "1") leadingZeroes++
  const bytes = new Uint8Array(leadingZeroes + body.length)
  bytes.set(body, leadingZeroes)
  return Option.some(bytes)
}

export const SvmAddress = S.String.check(
  S.makeFilter(
    (value) =>
      Option.match(base58Decode(value), {
        onNone: () => false,
        onSome: (bytes) => bytes.byteLength === 32,
      }),
    { expected: "a Base58-encoded 32-byte Solana address" },
  ),
).pipe(S.brand("crosshatch/SvmAddress"))

export const Blockhash = SvmAddress.pipe(S.brand("crosshatch/Blockhash"))

export type Address = typeof SvmAddress.Type
export type Blockhash = typeof Blockhash.Type
export type ProgramDerivedAddress = readonly [Address, number]

export const address = (value: string) => S.decodeEffect(SvmAddress)(value)

export const addressFromBytes = (bytes: Uint8Array) =>
  bytes.byteLength === 32
    ? Effect.succeed(SvmAddress.make(base58Encode(bytes)))
    : Effect.fail(
        new SvmProtocolError({
          message: `Solana address requires 32 bytes; got ${bytes.byteLength}`,
        }),
      )

export const addressToBytes = (value: Address): Uint8Array => {
  let integer = 0n
  for (const character of value) {
    integer = integer * 58n + ALPHABET_INDEX.get(character)!
  }
  const body: number[] = []
  while (integer > 0n) {
    body.push(Number(integer & 0xffn))
    integer >>= 8n
  }
  body.reverse()
  let leadingZeroes = 0
  while (leadingZeroes < value.length && value[leadingZeroes] === "1") leadingZeroes++
  const bytes = new Uint8Array(leadingZeroes + body.length)
  bytes.set(body, leadingZeroes)
  return bytes
}
export const addressFromPublicKey = (publicKey: typeof CryptoKey.CryptoKey.Type) =>
  CryptoKey.toBytes(publicKey).pipe(Effect.flatMap(addressFromBytes))

const createProgramAddress = Effect.fnUntraced(function* (programAddress: Address, seeds: ReadonlyArray<Uint8Array>) {
  if (seeds.length > 16) {
    return yield* new SvmProtocolError({ message: "A PDA supports at most 16 seeds" })
  }
  for (const [index, seed] of seeds.entries()) {
    if (seed.byteLength > 32) {
      return yield* new SvmProtocolError({ message: `PDA seed ${index} exceeds 32 bytes` })
    }
  }
  const seedLength = seeds.reduce((total, seed) => total + seed.byteLength, 0)
  const input = new Uint8Array(seedLength + 32 + PDA_MARKER.length)
  let offset = 0
  for (const seed of seeds) {
    input.set(seed, offset)
    offset += seed.length
  }
  input.set(addressToBytes(programAddress), offset)
  input.set(PDA_MARKER, offset + 32)
  const digest = yield* Effect.promise(() => crypto.subtle.digest("SHA-256", input)).pipe(
    Effect.map((v) => new Uint8Array(v)),
  )
  if (compressedPointIsOnCurve(digest)) return Option.none<Address>()
  return Option.some(yield* addressFromBytes(digest))
})

export const findProgramDerivedAddress = Effect.fnUntraced(function* (
  programAddress: Address,
  seeds: ReadonlyArray<Uint8Array>,
) {
  for (let bump = 255; bump > 0; bump--) {
    const candidate = yield* createProgramAddress(programAddress, [...seeds, Uint8Array.of(bump)])
    if (Option.isSome(candidate)) {
      return [candidate.value, bump] as const satisfies ProgramDerivedAddress
    }
  }
  return yield* new SvmProtocolError({ message: "Unable to find a viable PDA bump" })
})
