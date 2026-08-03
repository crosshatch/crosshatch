import { ensureRef } from "@crosshatch/util/ensureRef"
import { CurrentSocketProtocols } from "@crosshatch/util/SocketProtocols"
import { Array, Context, Effect, Schema as S, Layer, type Duration } from "effect"
import { HttpApiError } from "effect/unstable/httpapi"
import { Socket } from "effect/unstable/socket"

import * as Ed25519Pair from "./Ed25519Pair.ts"
import * as Ed25519PrivateKey from "./Ed25519PrivateKey.ts"
import * as Ed25519PublicKey from "./Ed25519PublicKey.ts"

const TypeId = "~crosshatch/Crypto/SocketSignature" as const

const ProtocolKey = "crosshatch-signature" as const

export type Service<A extends S.Top> = [
  | undefined
  | {
      readonly signer: Ed25519PublicKey.Ed25519PublicKey
      readonly input: string
      readonly payload: A["Type"]
      readonly signature: Uint8Array
    },
][0]

export interface Signature<Self, Id extends string, A extends S.Top> extends Context.Service<Self, Service<A>> {
  new (_: never): Context.ServiceClass.Shape<Id, Service<A>>

  readonly [TypeId]: typeof TypeId

  readonly payload: A
}

export const Service =
  <Self>() =>
  <Id extends string, A extends S.Top>(id: Id, payload: A): Signature<Self, Id, A> => {
    const tag = Context.Service<Self, Service<A>>()(id)
    return Object.assign(tag, { [TypeId]: TypeId, payload })
  }

export const ProtocolFromBase64UrlJsonString = S.StringFromBase64Url.pipe(
  S.decodeTo(
    S.Struct({
      signer: Ed25519PublicKey.Ed25519PublicKeyFromUint8Array,
      input: S.String,
      signature: S.Uint8Array,
    }).pipe(S.toCodecJson, S.fromJsonString),
  ),
)

export const layer = <Self, Id extends string, A extends S.Top>(signedPayload: Signature<Self, Id, A>) =>
  Layer.effect(
    signedPayload,
    Effect.gen(function* () {
      const protocols = yield* CurrentSocketProtocols
      if (!protocols) return
      const protocolI = protocols.indexOf(ProtocolKey)
      const protocol = protocols[protocolI + 1]
      if (!protocol) return
      const { signer, input, signature } = yield* S.decodeEffect(ProtocolFromBase64UrlJsonString)(protocol)
      const verified = yield* Ed25519PublicKey.verify(signer, signature, new TextEncoder().encode(input))
      if (!verified) {
        return yield* new HttpApiError.Unauthorized()
      }
      const payload = yield* S.decodeEffect(signedPayload.payload.pipe(S.toCodecJson, S.fromJsonString))(input)
      return { signer, payload, input, signature }
    }),
  )

export const makeSocket = <Self, Id extends string, A extends S.Top>(
  url: string,
  signedPayload: Signature<Self, Id, A>,
  payload: A["Type"],
  options?:
    | undefined
    | {
        readonly closeCodeIsError?: ((code: number) => boolean) | undefined
        readonly openTimeout?: Duration.Input | undefined
        readonly protocols?: string | Array<string> | undefined
      },
) =>
  Effect.gen(function* () {
    const { closeCodeIsError, openTimeout, protocols } = options ?? {}
    const { privateKey, publicKey: signer } = yield* Ed25519Pair.Ed25519Pair.pipe(ensureRef)
    const input = yield* S.encodeEffect(S.fromJsonString(S.toCodecJson(signedPayload.payload)))(payload)
    const signature = yield* Ed25519PrivateKey.sign(privateKey, new TextEncoder().encode(input))
    const protocol = yield* S.encodeEffect(ProtocolFromBase64UrlJsonString)({ input, signature, signer })
    return yield* Socket.makeWebSocket(url, {
      closeCodeIsError,
      openTimeout,
      protocols: [ProtocolKey, protocol, ...(protocols ? Array.ensure(protocols) : [])],
    })
  })
