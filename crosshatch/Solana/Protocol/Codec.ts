/* oxlint-disable no-bitwise -- byte-level codec */
import { Schema as S } from "effect"

export const U8 = S.toType(S.Int.check(S.isBetween({ minimum: 0, maximum: 255 })))
export const U32 = S.toType(S.Int.check(S.isBetween({ minimum: 0, maximum: 0xffffffff })))
export const U64 = S.BigInt.check(S.isBetweenBigInt({ minimum: 0n, maximum: 0xffffffffffffffffn }))

export const concat = (...parts: ReadonlyArray<Uint8Array>): Uint8Array => {
  const output = new Uint8Array(parts.reduce((length, part) => length + part.length, 0))
  let offset = 0
  for (const part of parts) {
    output.set(part, offset)
    offset += part.length
  }
  return output
}

export const u32le = (value: number) => {
  const bytes = new Uint8Array(4)
  new DataView(bytes.buffer).setUint32(0, value, true)
  return bytes
}

export const u64le = (value: bigint) => {
  const bytes = new Uint8Array(8)
  new DataView(bytes.buffer).setBigUint64(0, value, true)
  return bytes
}

export const encodeShortU16 = (value: number): Uint8Array => {
  const bytes: number[] = []
  let remaining = value
  do {
    let byte = remaining & 0x7f
    remaining >>>= 7
    if (remaining > 0) byte |= 0x80
    bytes.push(byte)
  } while (remaining > 0)
  return Uint8Array.from(bytes)
}
