import { Effect, Option } from "effect"

import { Info, Proof, SupportedChain } from "./Schema.ts"

export type Prover<E = unknown, R = never> = (
  info: typeof Info.Type,
  entry: typeof SupportedChain.Type,
) => Option.Option<Effect.Effect<typeof Proof.Type, E, R>>

export declare namespace Prover {
  export type Any = Prover<any, any>
  export type Context<T extends Any> = T extends Prover<any, infer R> ? R : never
}
