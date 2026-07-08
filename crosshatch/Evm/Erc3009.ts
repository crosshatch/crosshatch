import { Effect, Schema as S } from "effect"
import { getAddress, toHex, type Hex } from "viem"

import * as Adapter from "../Adapter.ts"
import { EvmSigner } from "./EvmSigner.ts"

export class Erc3009Adapter extends Adapter.Service<Erc3009Adapter>()("crosshatch/Erc3009Adapter") {}

export interface Erc3009 {
  readonly signature: string
  readonly authorization: {
    readonly from: Hex
    readonly to: Hex
    readonly value: string
    readonly validAfter: string
    readonly validBefore: string
    readonly nonce: Hex
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

export const layer = Erc3009Adapter.layer(
  Effect.fnUntraced(function* ({ accepted }) {
    const { name, version } = yield* S.decodeUnknownEffect(
      S.Struct({
        assetTransferMethod: S.Never.pipe(S.optional),
        name: S.String,
        version: S.String,
      }),
    )(accepted.extra)

    return Effect.gen(function* () {
      const now = Math.floor(Date.now() / 1000)
      const chainId = parseInt(accepted.network.split(":")[1]!)
      const signer = yield* EvmSigner
      const authorization: Erc3009["authorization"] = {
        from: signer.address,
        to: getAddress(accepted.payTo) as Hex,
        value: accepted.amount,
        validAfter: (now - 600).toString(),
        validBefore: (now + accepted.maxTimeoutSeconds).toString(),
        nonce: toHex(crypto.getRandomValues(new Uint8Array(32))),
      }
      const signature = yield* Effect.promise(() =>
        signer.signTypedData({
          domain: {
            name,
            version,
            chainId,
            verifyingContract: getAddress(accepted.asset),
          },
          types: ERC3009_ABI_TYPES,
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
      return { authorization, signature } satisfies Erc3009
    })
  }),
)
