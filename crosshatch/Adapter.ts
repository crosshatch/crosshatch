import { Context, Data, Effect, flow, Layer, Schema as S, Scope } from "effect"

import type { PhysicalAssetDeployment } from "./Asset.ts"
import type { Mnemonic } from "./Mnemonic.ts"
import type { Requirements } from "./Requirements.ts"

export class CreatePayloadError extends Data.TaggedError("CreatePayloadError")<{ readonly cause?: unknown }> {}

export type Adapt<R = never> = Effect.Effect<Record<string, S.Json>, CreatePayloadError, R>

export type Service<R = never, R2 = never> = ({
  accepted,
  deployment,
}: {
  readonly accepted: typeof Requirements.Type
  readonly deployment: PhysicalAssetDeployment
}) => Effect.Effect<Adapt<R> | undefined, S.SchemaError, R2>

const TypeId = "~crosshatch/Adapter" as const

export interface Adapter<Self, Id extends string> extends Context.Service<Self, Service> {
  new (_: never): Context.ServiceClass.Shape<Id, Service>

  readonly [TypeId]: typeof TypeId

  readonly layer: <R, R2>(make: Service<R, R2>) => Layer.Layer<Self, never, Exclude<R | R2, Scope.Scope>>
}

export const Service =
  <Self>() =>
  <Id extends string>(id: Id): Adapter<Self, Id> => {
    const tag = Context.Service<Self, Service>()(id)
    const layer = <R, R2>(f: Service<R, R2>): Layer.Layer<Self, never, Exclude<R | R2, Scope.Scope>> =>
      Layer.effect(
        tag,
        Effect.gen(function* () {
          const context = yield* Effect.context<Exclude<R | R2, Scope.Scope>>()
          const bound = flow(Effect.scoped, Effect.provide(Layer.succeedContext(context)))
          return flow(
            f,
            bound,
            Effect.fnUntraced(function* (outer) {
              const inner = yield* outer
              if (inner) {
                return inner.pipe(bound)
              }
              return undefined
            }),
          )
        }),
      )
    return Object.assign(tag, { [TypeId]: TypeId, layer })
  }

export interface AdapterModule<A> {
  readonly layerMnemonic: (mnemonic: typeof Mnemonic.Type) => Layer.Layer<A>
}
