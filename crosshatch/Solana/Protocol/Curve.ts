/* oxlint-disable no-bitwise -- byte-level curve math */
// Ed25519 compressed-point validation, adapted from the MIT-licensed
// implementation vendored by @solana/addresses 6.10.0.
const D = 37095705934669439343138083508754565189542113879843219016388785533085940283555n
const P = 57896044618658097711785492504343953926634992332820282019728792003956564819949n
const SQRT_MINUS_ONE = 19681161376707505956807079304988542015446066515923890162744021073123829784752n

const mod = (value: bigint) => {
  const result = value % P
  return result >= 0n ? result : P + result
}

const pow2 = (value: bigint, power: bigint) => {
  let result = value
  while (power-- > 0n) result = mod(result * result)
  return result
}

const pow252Minus3 = (value: bigint) => {
  const x2 = mod(value * value)
  const b2 = mod(x2 * value)
  const b4 = mod(pow2(b2, 2n) * b2)
  const b5 = mod(pow2(b4, 1n) * value)
  const b10 = mod(pow2(b5, 5n) * b5)
  const b20 = mod(pow2(b10, 10n) * b10)
  const b40 = mod(pow2(b20, 20n) * b20)
  const b80 = mod(pow2(b40, 40n) * b40)
  const b160 = mod(pow2(b80, 80n) * b80)
  const b240 = mod(pow2(b160, 80n) * b80)
  const b250 = mod(pow2(b240, 10n) * b10)
  return mod(pow2(b250, 2n) * value)
}

const squareRootRatio = (u: bigint, v: bigint): bigint | undefined => {
  const v3 = mod(v * v * v)
  const v7 = mod(v3 * v3 * v)
  let x = mod(u * v3 * pow252Minus3(u * v7))
  const vx2 = mod(v * x * x)
  if (vx2 === mod(-u)) x = mod(x * SQRT_MINUS_ONE)
  else if (vx2 !== u) return undefined
  if ((x & 1n) === 1n) x = mod(-x)
  return x
}

export const compressedPointIsOnCurve = (bytes: Uint8Array): boolean => {
  if (bytes.byteLength !== 32) return false
  const copy = bytes.slice()
  const xIsOdd = (copy[31]! & 0x80) !== 0
  copy[31]! &= 0x7f

  let y = 0n
  for (let index = 31; index >= 0; index--) y = (y << 8n) | BigInt(copy[index]!)
  const y2 = mod(y * y)
  const x = squareRootRatio(mod(y2 - 1n), mod(D * y2 + 1n))
  return x !== undefined && !(x === 0n && xIsOdd)
}
