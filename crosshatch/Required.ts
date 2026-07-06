import { String, Schema as S, Record, Effect, Context, Effectable } from "effect"

import { InvalidAmountError } from "./Amount.ts"
import type { Extension } from "./Extension.ts"
import { Requirements, type RequirementsLike } from "./Requirements.ts"
import { ResourceInfo } from "./ResourceInfo.ts"
import { Version } from "./Version.ts"

export const Required = S.Struct({
  accepts: S.Array(Requirements),
  error: S.String.pipe(S.optional),
  extensions: S.Record(S.String, S.Unknown).pipe(S.optional),
  resource: ResourceInfo,
  x402Version: Version,
})

export const RequiredFromBase64JsonString = S.StringFromBase64.pipe(
  S.decodeTo(S.fromJsonString(S.toCodecJson(Required))),
)

export type BuilderExtensionEntry<X> = readonly [X, unknown]

export interface BuilderConfig<X> {
  readonly template?: TemplateStringsArray | string | undefined
  readonly substitutions: ReadonlyArray<unknown>
  readonly extensionsEntries?: ReadonlyArray<BuilderExtensionEntry<X>> | undefined
  readonly acceptsInputs?: ReadonlyArray<RequirementsLike> | undefined
}

export class RequiredBuilder<E, R, X> extends Effectable.Class<typeof Required.Type, E, R> {
  readonly "": [X]
  readonly config
  constructor(config: BuilderConfig<X>) {
    super()
    this.config = config
  }

  override override = Effect.gen({ self: this }, function* () {
    const url = yield* RequiredUrl
    const {
      config: { template, substitutions, acceptsInputs, extensionsEntries },
    } = this
    return {
      x402Version: 2,
      resource: {
        url,
        ...(template && {
          description:
            typeof template === "string"
              ? template
              : String.stripMargin(globalThis.String.raw(template, ...(substitutions ?? []))),
        }),
      },
      accepts: yield* Effect.forEach(acceptsInputs ?? [], (v) => (Effect.isEffect(v) ? v : Effect.succeed(v))).pipe(
        Effect.map((v) => v.flat()),
      ) as never as Effect.Effect<ReadonlyArray<typeof Requirements.Type>, never>,
      extensions: yield* Effect.all(
        extensionsEntries?.map(([extension, payload]) => {
          const { name, payload: Payload } = extension as Extension.Any
          return S.encodeEffect(S.toCodecJson(Payload))(payload).pipe(Effect.map((encoded) => [name, encoded] as const))
        }) ?? [],
        { concurrency: "unbounded" },
      ).pipe(Effect.map(Record.fromEntries)) as Effect.Effect<never, never, R>,
    } satisfies typeof Required.Type
  })
}

export class RequiredUrl extends Context.Reference<string | undefined>("crosshatch/RequiredUrl", {
  defaultValue: () => undefined,
}) {}

export const make = (
  template?: TemplateStringsArray | string,
  ...substitutions: ReadonlyArray<unknown>
): RequiredBuilder<never, never, never> => new RequiredBuilder({ template, substitutions })

export const accept =
  (...acceptsInputs: ReadonlyArray<RequirementsLike>) =>
  <E, R, X>(builder: RequiredBuilder<E, R, X>): RequiredBuilder<E | InvalidAmountError, R, X> => {
    const { config } = builder
    return new RequiredBuilder({
      ...config,
      acceptsInputs: [...(config.acceptsInputs ?? []), ...acceptsInputs],
      extensionsEntries: config.extensionsEntries ?? [],
    })
  }

export const extend =
  <
    Self,
    K extends string,
    Name extends string,
    ExtensionPayload extends Extension.Payload,
    Success extends Extension.Success<ExtensionPayload>,
  >(
    extension: Extension<Self, K, Name, ExtensionPayload, Success>,
    payload: ExtensionPayload["Type"],
  ) =>
  <E, R, X extends Extension.Any>(
    builder: RequiredBuilder<E, R, X>,
  ): RequiredBuilder<E | S.SchemaError, R | ExtensionPayload["EncodingServices"], X | Self> => {
    const { config } = builder
    return new RequiredBuilder({
      ...config,
      acceptsInputs: config.acceptsInputs ?? [],
      extensionsEntries: [...(config.extensionsEntries ?? []), [extension, payload]] as never,
    })
  }
