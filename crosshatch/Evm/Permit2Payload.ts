import { Effect, Schema as S } from "effect"
import { getAddress, toHex } from "viem"

import type { Requirements } from "../X402/X402.ts"
import type { EvmSigner } from "./EvmSigner.ts"

const Permit2Authorization = S.Struct({
  from: S.String,
  permitted: S.Struct({
    token: S.String,
    amount: S.String,
  }),
  spender: S.String,
  nonce: S.String,
  deadline: S.String,
  witness: S.Struct({
    to: S.String,
    validAfter: S.String,
    extra: S.String.pipe(S.optional),
  }),
})

export const Permit2Payload = S.Struct({
  signature: S.String,
  permit2Authorization: Permit2Authorization,
})

const PERMIT2_ADDRESS = "0x000000000022D473030F116dDEE9F6B43aC78BA3"
const EXACT_PERMIT2_PROXY = "0x4020615294c913F045dc10f0a5cdEbd86c280001"

const permit2WitnessTypes = {
  PermitWitnessTransferFrom: [
    { name: "permitted", type: "TokenPermissions" },
    { name: "spender", type: "address" },
    { name: "nonce", type: "uint256" },
    { name: "deadline", type: "uint256" },
    { name: "witness", type: "Witness" },
  ],
  TokenPermissions: [
    { name: "token", type: "address" },
    { name: "amount", type: "uint256" },
  ],
  Witness: [
    { name: "to", type: "address" },
    { name: "validAfter", type: "uint256" },
    { name: "extra", type: "bytes" },
  ],
} as const

export const make = Effect.fnUntraced(function* (
  signer: EvmSigner,
  requirement: typeof Requirements.Requirements.Type,
) {
  const now = Math.floor(Date.now() / 1000)
  const chainId = parseInt(requirement.network.split(":")[1]!)
  const nonce = BigInt(toHex(crypto.getRandomValues(new Uint8Array(32)))).toString()
  const token = getAddress(requirement.asset) as `0x${string}`
  const { amount } = requirement
  const spender = EXACT_PERMIT2_PROXY as `0x${string}`
  const deadline = (now + requirement.maxTimeoutSeconds).toString()
  const witness = {
    to: getAddress(requirement.payTo) as `0x${string}`,
    validAfter: (now - 600).toString(),
    extra: "0x",
  }
  const permit2Authorization = {
    from: signer.address,
    permitted: { token, amount },
    spender,
    nonce,
    deadline,
    witness,
  }
  const signature = yield* Effect.promise(() =>
    signer.signTypedData({
      domain: {
        name: "Permit2",
        chainId,
        verifyingContract: PERMIT2_ADDRESS,
      },
      types: permit2WitnessTypes,
      primaryType: "PermitWitnessTransferFrom",
      message: {
        permitted: {
          token,
          amount: BigInt(amount),
        },
        spender: getAddress(spender),
        nonce: BigInt(nonce),
        deadline: BigInt(deadline),
        witness: {
          to: getAddress(witness.to),
          validAfter: BigInt(witness.validAfter),
          extra: witness.extra,
        },
      },
    }),
  )

  return { signature, permit2Authorization } satisfies typeof Permit2Payload.Type
})
