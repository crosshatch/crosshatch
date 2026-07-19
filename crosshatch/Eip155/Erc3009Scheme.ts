import { Effect, Schema as S, Encoding } from "effect"
import { Address, Hex } from "ox"

import * as Random from "../Crypto/Random.ts"
import * as Scheme from "../Scheme.ts"
import { Eip155Signer } from "./Eip155Signer.ts"

export const Extra = S.Struct({
  assetTransferMethod: S.Never.pipe(S.optional),
  name: S.String,
  version: S.String,
})

export class Erc3009Scheme extends Scheme.Service<Erc3009Scheme, void, typeof Extra.Type>()(
  "crosshatch/Eip155/Erc3009Scheme",
) {}

export interface Erc3009 {
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

export const ERC3009_ABI_TYPES = {
  TransferWithAuthorization: [
    { name: "from", type: "address" },
    { name: "to", type: "address" },
    { name: "value", type: "uint256" },
    { name: "validAfter", type: "uint256" },
    { name: "validBefore", type: "uint256" },
    { name: "nonce", type: "bytes32" },
  ],
} as const

export const layer = Erc3009Scheme.layer({ known: S.Void, extra: Extra }, () =>
  Effect.fnUntraced(function* ({ accepted, physical: { name, version } }) {
    const now = Math.floor(Date.now() / 1000)
    const chainId = parseInt(accepted.network.split(":")[1]!)
    const signer = yield* Eip155Signer
    const authorization: Erc3009["authorization"] = {
      from: signer.address,
      to: Address.from(accepted.payTo, { checksum: true }),
      value: accepted.amount,
      validAfter: (now - 600).toString(),
      validBefore: (now + accepted.maxTimeoutSeconds).toString(),
      nonce: `0x${Encoding.encodeHex(Random.bytes(32))}`,
    }
    const signature = signer.signTypedData({
      domain: {
        name,
        version,
        chainId,
        verifyingContract: Address.from(accepted.asset, { checksum: true }),
      },
      types: ERC3009_ABI_TYPES,
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
    return { authorization, signature } satisfies Erc3009
  }),
)
