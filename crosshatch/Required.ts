import { Schema as S, Effect, Data, ErrorReporter, Pipeable, Inspectable, Effectable } from "effect"
import {
  HttpServerRequest,
  HttpServerResponse,
  HttpServerRespondable,
  HttpTraceContext,
  Headers,
} from "effect/unstable/http"

import type * as AcceptsBuilder from "./AcceptsBuilder.ts"
import { PAYMENT_REQUIRED } from "./constants.ts"
import * as Extension from "./Extension.ts"
import * as Requirements from "./Requirements.ts"
import * as ResourceInfo from "./ResourceInfo.ts"

type RequiredProto = Effect.Effect<never, RequiredResponse, HttpServerRequest.HttpServerRequest>
const RequiredProto = Effectable.Prototype<Required>({
  label: "Required",
  evaluate: Effect.fnUntraced(function* (this: Required) {
    const request = yield* HttpServerRequest.HttpServerRequest
    return yield* new RequiredResponse({ request, required: this })
  }),
})

export class Required
  extends S.Class<Required>("Required")({
    x402Version: S.Literal(2),
    resource: ResourceInfo.ResourceInfo,
    accepts: S.Array(Requirements.Requirements),
    error: S.String.pipe(S.optional),
    extensions: Extension.ExtensionsEnvelope.pipe(S.optional),
  })
  implements RequiredProto
{
  declare pipe: Pipeable.Pipeable["pipe"]

  readonly [Effect.TypeId]: Effect.Variance<never, RequiredResponse, HttpServerRequest.HttpServerRequest> =
    RequiredProto[Effect.TypeId];

  [Symbol.iterator](): Effect.EffectIterator<RequiredProto> {
    return RequiredProto[Symbol.iterator]()
  }

  toJSON(): unknown {
    return RequiredProto.toJSON()
  }

  [Inspectable.NodeInspectSymbol](): unknown {
    return RequiredProto[Inspectable.NodeInspectSymbol]()
  }
}

export class RequiredResponse
  extends Data.TaggedError("RequiredResponse")<{
    readonly required: Required
    readonly request: HttpServerRequest.HttpServerRequest
  }>
  implements HttpServerRespondable.Respondable
{
  [HttpServerRespondable.symbol]() {
    return Effect.gen({ self: this }, function* () {
      const required = yield* S.encodeEffect(RequiredFromBase64JsonString)(this.required)
      const headers = yield* Effect.currentSpan.pipe(
        Effect.map(HttpTraceContext.toHeaders),
        Effect.catchTags({
          NoSuchElementError: () => Effect.succeed(Headers.empty),
        }),
        Effect.map(Headers.set(PAYMENT_REQUIRED, required)),
      )
      return HttpServerResponse.empty({ status: 402, headers })
    })
  }

  override readonly [ErrorReporter.ignore] = true

  get methodAndUrl() {
    return `${this.request.method} ${this.request.url}`
  }

  override get message() {
    return `${this._tag} (${this.methodAndUrl}): retry with an attached x402 payment payload`
  }
}

export const RequiredJson = S.toCodecJson(Required)
export const RequiredFromJsonString = S.fromJsonString(RequiredJson)
export const RequiredFromBase64JsonString = S.StringFromBase64.pipe(S.decodeTo(RequiredFromJsonString))

export declare const make: (
  e0: string | TemplateStringsArray,
  ...substitutions: ReadonlyArray<string | number>
) => (builder: AcceptsBuilder.Accepts) => Effect.Effect<Required>
