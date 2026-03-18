import type { Fields, FieldsRecord } from "@crosshatch/util/schema"

import { Context, Effect, Schema as S, Layer, Stream, Ref, PubSub } from "effect"

import * as Reducer from "./Reducer.ts"

export const TypeId = "~@crosshatch/state/Accumulator" as const

export interface StateDefinition<F extends Fields, EventDefinitions extends FieldsRecord> {
  readonly fields: F

  readonly events: EventDefinitions
}

export interface Service<F extends Fields, EventDefinitions extends FieldsRecord> {
  readonly accumulatorRef: Ref.Ref<S.Struct<F>["Type"]>

  readonly events: PubSub.PubSub<FieldsRecord.TaggedMember<EventDefinitions>>
}

export interface State<
  Self,
  Id extends string,
  F extends Fields,
  EventDefinitions extends FieldsRecord,
> extends Context.Tag<Self, Service<F, EventDefinitions>> {
  new (_: never): Context.TagClassShape<Id, Service<F, EventDefinitions>>

  readonly [TypeId]: typeof TypeId

  readonly definition: StateDefinition<F, EventDefinitions>

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

  readonly update: <K extends keyof F, E = never, R = never>(
    key: K,
    setter:
      | S.Schema.Type<F[K]>
      | Effect.Effect<S.Schema.Type<F[K]>, E, R>
      | ((value: S.Schema.Type<F[K]>) => S.Schema.Type<F[K]> | Effect.Effect<S.Schema.Type<F[K]>, E, R>),
  ) => Effect.Effect<void, E, R | Self>

  readonly stream: <K extends keyof F>(key: K) => Stream.Stream<S.Schema.Type<F[K]>, never, Self>

  readonly layer: <Reducers extends Reducer.Reducers<F, EventDefinitions>, E, R, E2 = never, R2 = never>(options: {
    readonly reducers: Reducers
    readonly events: Stream.Stream<FieldsRecord.TaggedMember<EventDefinitions>, E, R>
    readonly initial: S.Struct<F>["Type"] | Effect.Effect<S.Struct<F>["Type"], E2, R2>
  }) => Layer.Layer<
    Self,
    Effect.Effect.Error<ReturnType<Reducers[keyof Reducers]>> | E2,
    Exclude<Effect.Effect.Context<ReturnType<Reducers[keyof Reducers]>>, Self> | R2
  >
}

export const Service =
  <Self>() =>
  <Id extends string, F extends Fields, EventDefinitions extends FieldsRecord>(
    id: Id,
    definition: StateDefinition<F, EventDefinitions>,
  ): State<Self, Id, F, EventDefinitions> => {
    const tag = Context.Tag(id)<Self, Service<F, EventDefinitions>>()

    const reducer = <Tag extends keyof EventDefinitions, E, R>(
      _tag: Tag,
      f: Reducer.Reducer<S.Struct<EventDefinitions[Tag]>["Type"], F, E, R>,
    ): Reducer.Reducer<S.Struct<EventDefinitions[Tag]>["Type"], F, E, R> => f

    const update = Effect.fn(function* () {
      throw 0
    })

    const stream = <K extends keyof F>(_key: K) => Stream.empty

    const layer = <Reducers extends Reducer.Reducers<F, EventDefinitions>, E = never, R = never>(_options: {
      readonly initial: S.Struct<F>["Type"] | Effect.Effect<S.Struct<F>["Type"], E, R>
      readonly reducers: Reducers
    }): Layer.Layer<
      Self,
      Effect.Effect.Error<ReturnType<Reducers[keyof Reducers]>> | E,
      Exclude<Effect.Effect.Context<ReturnType<Reducers[keyof Reducers]>>, Self> | R
    > => null!

    return Object.assign(tag, { [TypeId]: TypeId, definition, reducer, update, stream, layer })
  }
