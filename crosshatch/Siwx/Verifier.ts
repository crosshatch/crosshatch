import { Effect } from "effect"

import type { AuthenticatedIdentity } from "./Identity.ts"
import { Proof } from "./Schema.ts"

export interface Verifier<E = unknown, R = never> {
  readonly type: string
  readonly scheme: string
  readonly supportsChainId: (chainId: string) => boolean
  readonly verify: (proof: typeof Proof.Type) => Effect.Effect<AuthenticatedIdentity, E, R>
}

export declare namespace Verifier {
  export type Any = Verifier<any, any>
  export type Error<T extends Any> = T extends Verifier<infer E, any> ? E : never
  export type Context<T extends Any> = T extends Verifier<any, infer R> ? R : never
}
