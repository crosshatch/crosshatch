import { Context, Effect, Layer } from "effect"

const TypeId = "~@crosshatch/alchemy/Prelude" as const

export interface Service<Self, Identifier extends string, A, E, R> extends Context.Service<Self, A> {
  new (_: never): Context.ServiceClass.Shape<Identifier, A>

  readonly [TypeId]: typeof TypeId

  readonly prelude: Effect.Effect<Layer.Layer<Self>, E, R>
}

export const Service =
  <Self>() =>
  <Identifier extends string, A, E, R>(
    id: Identifier,
    make: Effect.Effect<A, E, R>,
  ): Service<Self, Identifier, A, E, R> => {
    const service = Context.Service<Self, A>()(id)
    const self: Service<Self, Identifier, A, E, R> = Object.assign(service, {
      [TypeId]: TypeId,
      prelude: Effect.gen(function* () {
        const env = yield* make
        return Layer.succeed(self, env)
      }),
    })
    return self
  }
