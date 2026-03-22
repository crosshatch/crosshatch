import { Schema as S, Effect } from "effect"

const TypeId = "~liminal/MethodDefinition" as const

export interface MethodDefinition<P extends S.Struct.Fields, AA, AI, EA, EI> {
  readonly [TypeId]: typeof TypeId
  readonly payload: P
  readonly success: S.Schema<AA, AI>
  readonly failure: S.Schema<EA, EI>
}

export declare namespace MethodDefinition {
  export type Any =
    | MethodDefinition<S.Struct.Fields, any, any, any, any>
    | MethodDefinition<S.Struct.Fields, any, any, never, never>
}

export const make = <const P extends S.Struct.Fields, AA, AI, EA, EI>({
  payload,
  success,
  failure,
}: {
  readonly payload: P
  readonly success: S.Schema<AA, AI>
  readonly failure: S.Schema<EA, EI>
}): MethodDefinition<P, AA, AI, EA, EI> => ({
  [TypeId]: TypeId,
  payload,
  success,
  failure,
})

export type Handler<MethodDefinition extends MethodDefinition.Any, R> = (
  payload: S.Struct<MethodDefinition["payload"]>["Type"],
) => Effect.Effect<MethodDefinition["success"]["Type"], MethodDefinition["failure"]["Type"], R>

export type Handlers<MethodDefinitions extends Record<string, MethodDefinition.Any>, R> = {
  [K in keyof MethodDefinitions]: Handler<MethodDefinitions[K], R>
}

export const handler = <M extends MethodDefinition.Any, R>(_method: M, f: Handler<M, R>): Handler<M, R> => f
