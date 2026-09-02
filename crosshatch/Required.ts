import { Schema as S, Effect, Data, ErrorReporter, Pipeable, Types } from "effect"
import {
  HttpServerRequest,
  HttpServerResponse,
  HttpServerRespondable,
  HttpTraceContext,
  Headers,
} from "effect/unstable/http"

import * as Address from "./Address.ts"
import type * as Amount from "./Amount.ts"
import { PAYMENT_REQUIRED } from "./constants.ts"
import * as Extension from "./Extension.ts"
import type * as Instrument from "./Instrument.ts"
import type * as Namespace from "./Namespace.ts"
import type * as Payload from "./Payload.ts"
import * as Requirements from "./Requirements.ts"
import * as ResourceInfo from "./ResourceInfo.ts"

export class Required extends S.Class<Required>("Required")({
  x402Version: S.Literal(2),
  resource: ResourceInfo.ResourceInfo,
  accepts: S.Array(Requirements.Requirements),
  error: S.String.pipe(S.optional),
  extensions: Extension.ExtensionsEnvelope.pipe(S.optional),
}) {
  *[Symbol.iterator](): Effect.EffectIterator<
    | Effect.Effect<HttpServerRequest.HttpServerRequest, never, HttpServerRequest.HttpServerRequest>
    | Effect.Effect<never, RequiredResponse, never>
  > {
    const request = yield* HttpServerRequest.HttpServerRequest
    return yield* new RequiredResponse({ request, required: this })
  }
}

export const RequiredJson = S.toCodecJson(Required)
export const RequiredFromJsonString = S.fromJsonString(RequiredJson)
export const RequiredFromBase64JsonString = S.StringFromBase64.pipe(S.decodeTo(RequiredFromJsonString))

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

const BuilderTypeId = "~crosshatch/Required/RequiredBuilder" as const

interface RequiredBuilder<K extends string> extends Pipeable.Pipeable {
  readonly [BuilderTypeId]: typeof BuilderTypeId

  readonly _tag: K
}

// oxlint-disable-next-line typescript/no-empty-interface
export interface Empty extends RequiredBuilder<"Empty"> {}

interface NonEmpty<K extends string> extends RequiredBuilder<K> {
  readonly accepts: ReadonlyArray<ReadonlyArray<Requirements.Requirements>>

  readonly recipients: ReadonlyArray<Record<string, Address.Address>>
}

// oxlint-disable-next-line typescript/no-empty-interface
export interface Unaddressed<NamespaceShapes_ extends Namespace.NamespaceShape.Any> extends NonEmpty<"Unaddressed"> {
  readonly?: [NamespaceShapes_]
}

export interface Accepts extends NonEmpty<"Undescribed"> {
  (e0: string | TemplateStringsArray, ...substitutions: ReadonlyArray<string | number>): Effect.Effect<Required>

  readonly match: (payload: Payload.Payload | undefined) => boolean
}

export declare const empty: Empty

export declare const accept: <const T extends Instrument.InstrumentsInput>(
  instruments: T,
  amount: Amount.AmountInput,
) => <NamespaceShapes_ extends Namespace.NamespaceShape.Any = never>(
  builder: Empty | Unaddressed<NamespaceShapes_> | Accepts,
) => Unaddressed<Instrument.FromInput<T>["namespace"]>

export declare const address: <NamespaceShapes_ extends Namespace.NamespaceShape.Any>(addresses: {
  readonly [K in NamespaceShapes_["_tag"]]: Types.ExtractTag<NamespaceShapes_, K>["address"]
}) => (builder: Unaddressed<NamespaceShapes_>) => Accepts

export declare const describe: (
  e0: string | TemplateStringsArray,
  ...substitutions: ReadonlyArray<string | number>
) => (builder: Accepts) => Effect.Effect<Required>
