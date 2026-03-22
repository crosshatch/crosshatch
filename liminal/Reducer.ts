import { type Effect, Schema as S } from "effect"

import type { FieldsRecord } from "./_type_util.ts"

export type Reducers<Accumulator extends S.Struct.Fields, EventDefinitions extends FieldsRecord> = {
  [K in keyof EventDefinitions]: Reducer<S.Struct<EventDefinitions[K]>["Type"], Accumulator, any, any>
}

export type Reducer<T, Accumulator extends S.Struct.Fields, E, R> = (
  event: T,
  accumulator: S.Struct<Accumulator>["Type"],
) => Effect.Effect<void, E, R>
