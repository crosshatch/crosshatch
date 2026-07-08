import { Context, Data, Effect, flow, Layer, Schema as S, Scope } from "effect"

import type { PhysicalAssetDeployment } from "./Asset.ts"
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

const TypeId = "~crosshatch/PayloadAdapter" as const

export interface PayloadAdapter<Self, Id extends string> extends Context.Service<Self, Service> {
  new (_: never): Context.ServiceClass.Shape<Id, Service>

  readonly [TypeId]: typeof TypeId

  readonly layer: <R, R2>(make: Service<R, R2>) => Layer.Layer<Self, never, Exclude<R | R2, Scope.Scope>>
}

export const Service =
  <Self>() =>
  <Id extends string>(id: Id): PayloadAdapter<Self, Id> => {
    const tag = Context.Service<Self, Service>()(id)
    const layer = <R, R2>(f: Service<R, R2>): Layer.Layer<Self, never, Exclude<R | R2, Scope.Scope>> =>
      Layer.effect(
        tag,
        Effect.gen(function* () {
          const context = yield* Effect.context<R | R2>()
          const provide = Effect.provide(Layer.succeedContext(context))
          return flow(
            f,
            provide,
            Effect.fnUntraced(function* (outer) {
              const inner = yield* outer
              if (inner) {
                return inner.pipe(Effect.scoped, provide)
              }
              return undefined
            }),
          )
        }),
      )
    return Object.assign(tag, { [TypeId]: TypeId, layer })
  }
