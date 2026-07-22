/* oxlint-disable no-bitwise -- byte-level codec */
import { Option } from "effect"

const ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
const ALPHABET_INDEX = new Map(Array.from(ALPHABET, (character, index) => [character, BigInt(index)]))

export const encode = (bytes: Uint8Array): string => {
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

export const decode = (value: string): Option.Option<Uint8Array> => {
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
