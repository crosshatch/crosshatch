import { Effect, Schema as S } from "effect"
import { getAddress, toHex } from "viem"

import { CreatePayloadError } from "../Payer.ts"
import { Requirements } from "../Requirements.ts"
import type { EvmSigner } from "./EvmSigner.ts"

const Erc3009Authorization = S.Struct({
  from: S.String,
  to: S.String,
  value: S.String,
  validAfter: S.String,
  validBefore: S.String,
  nonce: S.String,
})

export const Erc3009Payload = S.Struct({
  signature: S.String,
  authorization: Erc3009Authorization,
})

const authorizationTypes = {
  TransferWithAuthorization: [
    { name: "from", type: "address" },
    { name: "to", type: "address" },
    { name: "value", type: "uint256" },
    { name: "validAfter", type: "uint256" },
    { name: "validBefore", type: "uint256" },
    { name: "nonce", type: "bytes32" },
  ],
} as const

export const make = Effect.fnUntraced(function* (signer: EvmSigner, requirement: typeof Requirements.Type) {
  if (!requirement.extra?.name || !requirement.extra?.version) {
    // TODO: inner schema error
    return yield* new CreatePayloadError({})
  }
  const now = Math.floor(Date.now() / 1000)
  const chainId = parseInt(requirement.network.split(":")[1]!)
  const authorization: typeof Erc3009Authorization.Type = {
    from: signer.address,
    to: getAddress(requirement.payTo) as `0x${string}`,
    value: requirement.amount,
    validAfter: (now - 600).toString(),
    validBefore: (now + requirement.maxTimeoutSeconds).toString(),
    nonce: toHex(crypto.getRandomValues(new Uint8Array(32))),
  }
  const signature = yield* Effect.promise(() =>
    signer.signTypedData({
      domain: {
        name: requirement.extra?.name,
        version: requirement.extra?.version,
        chainId,
        verifyingContract: getAddress(requirement.asset),
      },
      types: authorizationTypes,
      primaryType: "TransferWithAuthorization",
      message: {
        from: getAddress(authorization.from),
        to: getAddress(authorization.to),
        value: BigInt(authorization.value),
        validAfter: BigInt(authorization.validAfter),
        validBefore: BigInt(authorization.validBefore),
        nonce: authorization.nonce,
      },
    }),
  )
  return { authorization, signature } satisfies typeof Erc3009Payload.Type
})
