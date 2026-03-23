import { Function, Record, PubSub, Context, Effect, Schema as S, Layer, Stream, Ref } from "effect"

import type { FieldsRecord } from "./_type_util.ts"

import * as Reducer from "./Reducer.ts"

export const TypeId = "~liminal/Accumulator" as const

export interface AccumulatorDefinition<F extends S.Struct.Fields, EventDefinitions extends FieldsRecord> {
  readonly fields: F

  readonly events: EventDefinitions
}

export interface Service<F extends S.Struct.Fields> {
  readonly accumulator: Ref.Ref<S.Struct<F>["Type"]>

  readonly signals: {
    readonly [K in keyof F]: PubSub.PubSub<S.Schema.Type<F[K]>>
  }
}

const apply = Effect.fnUntraced(function* <A, E = never, R = never>(
  value: A,
  setter: A | Effect.Effect<A, E, R> | ((value: A) => A | Effect.Effect<A, E, R>),
): Effect.fn.Return<A, E, R> {
  if (Effect.isEffect(setter)) {
    return yield* setter
  } else if (Function.isFunction(setter)) {
    const applied = setter(value)
    if (Effect.isEffect(applied)) {
      return yield* applied
    }
    return applied
  }
  return value
})

type AccumulatorSet<Self, F extends S.Struct.Fields> = <E = never, R = never>(
  setter:
    | S.Struct<F>["Type"]
    | Effect.Effect<S.Struct<F>["Type"], E, R>
    | ((value: S.Struct<F>["Type"]) => S.Struct<F>["Type"] | Effect.Effect<S.Struct<F>["Type"], E, R>),
) => Effect.Effect<void, E, R | Self>

type AccumulatorUpdate<Self, F extends S.Struct.Fields> = <K extends keyof F, E = never, R = never>(
  key: K,
  setter:
    | S.Schema.Type<F[K]>
    | Effect.Effect<S.Schema.Type<F[K]>, E, R>
    | ((value: S.Schema.Type<F[K]>) => S.Schema.Type<F[K]> | Effect.Effect<S.Schema.Type<F[K]>, E, R>),
) => Effect.Effect<void, E, R | Self>

type AccumulatorSignal<Self, F extends S.Struct.Fields> = <K extends keyof F>(
  key: K,
) => Stream.Stream<S.Schema.Type<F[K]>, never, Self>

export interface Accumulator<
  Self,
  Id extends string,
  F extends S.Struct.Fields,
  EventDefinitions extends FieldsRecord,
> extends Context.Tag<Self, Service<F>> {
  new (_: never): Context.TagClassShape<Id, Service<F>>

  readonly [TypeId]: typeof TypeId

  readonly definition: AccumulatorDefinition<F, EventDefinitions>

  readonly state: Effect.Effect<S.Struct<F>["Type"], never, Self>

  readonly reducer: <Tag extends keyof EventDefinitions, E, R>(
    tag: Tag,
    f: Reducer.Reducer<S.Struct<EventDefinitions[Tag]>["Type"], F, E, R>,
  ) => Reducer.Reducer<S.Struct<EventDefinitions[Tag]>["Type"], F, E, R>

  readonly set: <E = never, R = never>(
    setter:
      | S.Struct<F>["Type"]
      | Effect.Effect<S.Struct<F>["Type"], E, R>
      | ((value: S.Struct<F>["Type"]) => S.Struct<F>["Type"] | Effect.Effect<S.Struct<F>["Type"], E, R>),
  ) => Effect.Effect<void, E, R | Self>

  readonly update: AccumulatorUpdate<Self, F>

  readonly signal: AccumulatorSignal<Self, F>
}

export const Service =
  <Self>() =>
  <Id extends string, F extends S.Struct.Fields, EventDefinitions extends FieldsRecord>(
    id: Id,
    definition: AccumulatorDefinition<F, EventDefinitions>,
  ): Accumulator<Self, Id, F, EventDefinitions> => {
    const tag = Context.Tag(id)<Self, Service<F>>()

    const state = Effect.gen(function* () {
      const { accumulator } = yield* tag
      return yield* Ref.get(accumulator)
    })

    const reducer = <Tag extends keyof EventDefinitions, E, R>(
      _tag: Tag,
      f: Reducer.Reducer<S.Struct<EventDefinitions[Tag]>["Type"], F, E, R>,
    ): Reducer.Reducer<S.Struct<EventDefinitions[Tag]>["Type"], F, E, R> => f

    const set: AccumulatorSet<Self, F> = Effect.fnUntraced(function* (setter) {
      const { accumulator, signals } = yield* tag
      let current = yield* Ref.get(accumulator)
      current = yield* apply(current, setter)
      yield* Ref.set(accumulator, current)
      for (let [key, signal] of Record.toEntries(signals)) {
        yield* signal.publish(current[key as keyof typeof current] as never)
      }
    })

    const update: AccumulatorUpdate<Self, F> = Effect.fnUntraced(function* (key, setter) {
      const { accumulator, signals } = yield* tag
      let { [key]: current } = yield* Ref.get(accumulator)

      // TODO: is there a way to get this inferred correctly?
      current = yield* apply(current as never, setter)
      yield* signals[key].publish(current as never)
    })

    const signal = <K extends keyof F>(key: K) =>
      Effect.gen(function* () {
        const { signals } = yield* tag
        const signal = signals[key]
        return Stream.fromPubSub(signal)
      }).pipe(Stream.unwrap)

    return Object.assign(tag, { [TypeId]: TypeId, state, definition, reducer, set, update, signal })
  }

export const layer = <
  Self,
  Id extends string,
  F extends S.Struct.Fields,
  EventDefinitions extends FieldsRecord,
  Reducers extends Reducer.Reducers<F, EventDefinitions>,
  E,
  R,
>(_options: {
  readonly accumulator: Accumulator<Self, Id, F, EventDefinitions>
  readonly source: Stream.Stream<FieldsRecord.TaggedMember.Type<EventDefinitions>, E, R>
  readonly reducers: Reducers
}): Layer.Layer<
  Self,
  E | Effect.Effect.Error<ReturnType<Reducers[keyof Reducers]>>,
  Exclude<R | Stream.Stream.Context<ReturnType<Reducers[keyof Reducers]>>, Self>
> => null!
