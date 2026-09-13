import { DateTime, Effect, Schema as S, Encoding, Crypto } from "effect"
import { Address } from "ox"

import { Mechanism } from "../../index.ts"
import { MakePayloadError } from "../../Mechanism.ts"
import { Eip155Signer } from "./Eip155Signer.ts"

const Extra = S.Struct({
  assetTransferMethod: S.Literal("permit2"),
  name: S.String,
  version: S.String,
  supportsEip2612: S.Boolean.pipe(S.optionalKey),
})

export class Permit2Scheme extends Mechanism.Service<
  Permit2Scheme,
  typeof Extra.Type,
  {
    readonly signature: string
    readonly permit2Authorization: {
      readonly from: string
      readonly permitted: {
        readonly token: string
        readonly amount: string
      }
      readonly spender: string
      readonly nonce: string
      readonly deadline: string
      readonly witness: {
        readonly to: string
        readonly validAfter: string
      }
    }
  }
>()("crosshatch/Cryptocurrency/namespaces/Eip155/Permit2Scheme") {}

export const layer = Mechanism.layer(
  Permit2Scheme,
  Effect.fnUntraced(
    function* ({ accepted }) {
      const signer = yield* Eip155Signer
      const now = Math.floor(DateTime.toEpochMillis(yield* DateTime.now) / 1000)
      const chainId = parseInt(accepted.network.reference)
      const crypto = yield* Crypto.Crypto
      const nonce = yield* crypto.randomBytes(32).pipe(
        Effect.map(Encoding.encodeHex),
        Effect.map((v) => BigInt(`0x${v}`)),
      )
      const token = Address.from(accepted.asset, { checksum: true })
      const { amount } = accepted
      const spender = Address.from(EXACT_PERMIT2_PROXY_ADDRESS)
      const deadline = (now + accepted.maxTimeoutSeconds).toString()
      const to = Address.from(accepted.payTo, { checksum: true })
      const validAfter = "0"
      const signature = yield* signer.signTypedData({
        domain: {
          name: "Permit2",
          chainId,
          verifyingContract: PERMIT2_ADDRESS,
        },
        types: ABI,
        primaryType: "PermitWitnessTransferFrom",
        message: {
          permitted: {
            token,
            amount: BigInt(amount),
          },
          spender: Address.from(spender, { checksum: true }),
          nonce,
          deadline: BigInt(deadline),
          witness: {
            to,
            validAfter: BigInt(validAfter),
          },
        },
      })
      return {
        signature,
        permit2Authorization: {
          from: signer.address,
          permitted: { token, amount },
          spender,
          nonce: nonce.toString(),
          deadline,
          witness: { to, validAfter },
        },
      }
    },
    Effect.mapError((cause) => new MakePayloadError({ cause })),
  ),
)

const PERMIT2_ADDRESS = "0x000000000022D473030F116dDEE9F6B43aC78BA3"
const EXACT_PERMIT2_PROXY_ADDRESS = "0x402085c248EeA27D92E8b30b2C58ed07f9E20001"

const ABI = {
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
  ],
} as const
