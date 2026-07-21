import type { Effect } from "effect"

import type { Info } from "./Schema.ts"

export interface Prover<R = never> {
  readonly type: string
  readonly scheme: string
  readonly supportsChainId: (chainId: string) => boolean
  readonly sign: (
    info: typeof Info.Type,
    chainId: string,
  ) => Effect.Effect<{ readonly address: string; readonly signature: string }, unknown, R>
}

export declare namespace Prover {
  export type Any = Prover<any>
  export type Context<T extends Any> = T extends Prover<infer R> ? R : never
}
