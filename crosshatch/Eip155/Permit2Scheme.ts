import { Effect, Schema as S, Encoding } from "effect"
import { Address } from "ox"

import { Random } from "../Crypto/Crypto.ts"
import { Scheme } from "../index.ts"
import { Eip155Signer } from "./Eip155Signer.ts"

export type Extra = typeof Extra.Type
export const Extra = S.Struct({
  assetTransferMethod: S.Literal("permit2"),
  name: S.String.pipe(S.optional),
  version: S.String.pipe(S.optional),
})

export class Permit2Scheme extends Scheme.Service<Permit2Scheme, void, Extra>()("crosshatch/Eip155/Permit2Scheme") {}

export interface Permit2 {
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

export const PERMIT2_ADDRESS = "0x000000000022D473030F116dDEE9F6B43aC78BA3"
export const EXACT_PERMIT2_PROXY = "0x402085c248EeA27D92E8b30b2C58ed07f9E20001"

export const PERMIT2_ABI_TYPES = {
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

export const layer = Permit2Scheme.layer({ known: S.Void, extra: Extra }, () =>
  Effect.fnUntraced(function* ({ accepted }) {
    const signer = yield* Eip155Signer
    const now = Math.floor(Date.now() / 1000)
    const chainId = parseInt(accepted.network.split(":")[1]!)
    const nonce = BigInt(`0x${Encoding.encodeHex(Random.bytes(32))}`).toString()
    const token = Address.from(accepted.asset, { checksum: true })
    const { amount } = accepted
    const spender = Address.from(EXACT_PERMIT2_PROXY)
    const deadline = (now + accepted.maxTimeoutSeconds).toString()
    const to = Address.from(accepted.payTo, { checksum: true })
    const validAfter = "0"
    const permit2Authorization: Permit2["permit2Authorization"] = {
      from: signer.address,
      permitted: { token, amount },
      spender,
      nonce,
      deadline,
      witness: { to, validAfter },
    }
    const signature = signer.signTypedData({
      domain: {
        name: "Permit2",
        chainId,
        verifyingContract: PERMIT2_ADDRESS,
      },
      types: PERMIT2_ABI_TYPES,
      primaryType: "PermitWitnessTransferFrom",
      message: {
        permitted: {
          token,
          amount: BigInt(amount),
        },
        spender: Address.from(spender, { checksum: true }),
        nonce: BigInt(nonce),
        deadline: BigInt(deadline),
        witness: {
          to,
          validAfter: BigInt(validAfter),
        },
      },
    })
    return { signature, permit2Authorization } satisfies Permit2
  }),
)
