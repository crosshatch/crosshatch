import { DateTime, Effect, Schema as S, Encoding, Crypto } from "effect"
import { Address, type Hex } from "ox"

import { Scheme, Adapt } from "../../index.ts"
import type { Eip155 } from "./Eip155.ts"
import { Eip155Signer } from "./Eip155Signer.ts"

const Extra = S.Struct({
  assetTransferMethod: S.Literal("eip3009").pipe(S.optional),
  name: S.String,
  version: S.String,
})

export class Erc3009Scheme extends Scheme.Service<
  Erc3009Scheme,
  Eip155,
  typeof Extra.Type,
  {
    readonly signature: string
    readonly authorization: {
      readonly from: Hex.Hex
      readonly to: Hex.Hex
      readonly value: string
      readonly validAfter: string
      readonly validBefore: string
      readonly nonce: Hex.Hex
    }
  }
>()("crosshatch/namespaces/Eip155/Erc3009Scheme") {}

export const layer = Erc3009Scheme.layer(
  Extra,
  Effect.fnUntraced(function* ({ accepted, extra: { name, version } }) {
    const now = Math.floor(DateTime.toEpochMillis(yield* DateTime.now) / 1000)
    const chainId = parseInt(accepted.network.reference)
    const signer = yield* Eip155Signer
    const crypto = yield* Crypto.Crypto
    const nonce = yield* crypto.randomBytes(32).pipe(
      Effect.map(Encoding.encodeHex),
      Effect.map((v) => `0x${v}` as const),
      Effect.mapError((cause) => new Adapt.AdaptError({ cause })),
    )
    const authorization = {
      from: signer.address,
      to: Address.from(accepted.payTo.raw, { checksum: true }),
      value: accepted.amount,
      validAfter: Math.max(0, now - 600).toString(),
      validBefore: (now + accepted.maxTimeoutSeconds).toString(),
      nonce,
    }
    const signature = signer.signTypedData({
      domain: {
        name,
        version,
        chainId,
        verifyingContract: Address.from(accepted.asset.raw, { checksum: true }),
      },
      types: ABI,
      primaryType: "TransferWithAuthorization",
      message: {
        from: Address.from(authorization.from, { checksum: true }),
        to: Address.from(authorization.to, { checksum: true }),
        value: BigInt(authorization.value),
        validAfter: BigInt(authorization.validAfter),
        validBefore: BigInt(authorization.validBefore),
        nonce: authorization.nonce,
      },
    })
    return { authorization, signature }
  }),
)

const ABI = {
  TransferWithAuthorization: [
    { name: "from", type: "address" },
    { name: "to", type: "address" },
    { name: "value", type: "uint256" },
    { name: "validAfter", type: "uint256" },
    { name: "validBefore", type: "uint256" },
    { name: "nonce", type: "bytes32" },
  ],
} as const
