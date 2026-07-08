import { Effect, Layer, Schema as S } from "effect"
import { getAddress, toHex } from "viem"

import * as Adapter from "../Adapter.ts"
import { EvmSigner } from "../Evm/Evm.ts"
import { CreatePayloadError } from "../Payer.ts"
import { Requirements } from "../Requirements.ts"

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

export class Eip3009Adapter extends Adapter.Service<Eip3009Adapter>()("crosshatch/Eip3009Adapter") {}

export const layer = Eip3009Adapter.layer(
  Effect.fnUntraced(function* (requirements) {
    const { name, version } = yield* S.decodeUnknownEffect(
      S.Struct({
        assetTransferMethod: S.Never.pipe(S.optional),
        name: S.String,
        version: S.String,
      }),
    )(requirements.extra)
    const now = Math.floor(Date.now() / 1000)
    const chainId = parseInt(requirements.network.split(":")[1]!)
    const signer = yield* EvmSigner.EvmSigner
    const authorization: typeof Erc3009Authorization.Type = {
      from: signer.address,
      to: getAddress(requirements.payTo) as `0x${string}`,
      value: requirements.amount,
      validAfter: (now - 600).toString(),
      validBefore: (now + requirements.maxTimeoutSeconds).toString(),
      nonce: toHex(crypto.getRandomValues(new Uint8Array(32))),
    }
    const signature = yield* Effect.promise(() =>
      signer.signTypedData({
        domain: {
          name,
          version,
          chainId,
          verifyingContract: getAddress(requirements.asset),
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
  }),
  Effect.fnUntraced(function* (accepted) {
    const signer = yield* EvmSigner.EvmSigner
    return yield* make(signer, accepted)
  }),
)

export const layerSigner = Layer.succeed(
  Adapter.Adapter,
  Effect.fnUntraced(function* ({ accepted }) {
    const method = accepted.extra?.assetTransferMethod ?? "eip3009"
    return yield* (method === "permit2" ? Permit2Payload : Erc3009Payload).make(signer, accepted)
  }),
)
