import { HexString } from "@crosshatch/util"
import { DateTime, Effect, Schema as S, Encoding, Crypto } from "effect"
import { Address } from "ox"

import { Mechanism } from "../../index.ts"
import { MakePayloadError } from "../../Mechanism.ts"
import { Eip155Signer } from "./Eip155Signer.ts"

const Extra = S.Struct({
  assetTransferMethod: S.Literal("eip3009").pipe(S.optionalKey),
  name: S.String,
  version: S.String,
})

export class Erc3009Payload extends S.Class<Erc3009Payload>("Erc3009Payload")({
  signature: S.String,
  authorization: S.Struct({
    from: HexString,
    to: HexString,
    value: S.String,
    validAfter: S.String,
    validBefore: S.String,
    nonce: HexString,
  }),
}) {}

export class Erc3009Mechanism extends Mechanism.Service<Erc3009Mechanism, Erc3009Payload>()(
  "crosshatch/Cryptocurrency/namespaces/Eip155/Erc3009Scheme",
  Extra,
) {}

export const make = Mechanism.layerClient(
  Erc3009Mechanism,
  Effect.fnUntraced(
    function* ({ accepted, extra: { name, version } }) {
      const now = Math.floor(DateTime.toEpochMillis(yield* DateTime.now) / 1000)
      const chainId = parseInt(accepted.network.reference)
      const signer = yield* Eip155Signer
      const crypto = yield* Crypto.Crypto
      const nonce = yield* crypto.randomBytes(32).pipe(
        Effect.map(Encoding.encodeHex),
        Effect.map((v) => `0x${v}` as const),
      )
      const authorization = {
        from: signer.address,
        to: Address.from(accepted.payTo, { checksum: true }),
        value: accepted.amount,
        validAfter: Math.max(0, now - 600).toString(),
        validBefore: (now + accepted.maxTimeoutSeconds).toString(),
        nonce,
      }
      const signature = yield* signer.signTypedData({
        domain: {
          name,
          version,
          chainId,
          verifyingContract: Address.from(accepted.asset, { checksum: true }),
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
    },
    Effect.mapError((cause) => new MakePayloadError({ cause })),
  ),
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
