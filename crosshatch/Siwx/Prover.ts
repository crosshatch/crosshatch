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

export const make =
  <E, R>({
    type,
    scheme = type,
    supportsChainId,
    sign,
  }: {
    readonly type: string
    readonly scheme?: string
    readonly supportsChainId: (chainId: string) => boolean
    readonly sign: (
      info: typeof Info.Type,
      chainId: string,
    ) => Effect.Effect<{ readonly address: string; readonly signature: string }, E, R>
  }): Prover<E, R> =>
  (info, entry) =>
    supportsChainId(entry.chainId) &&
    entry.type === type &&
    (entry.signatureScheme === undefined || entry.signatureScheme === scheme)
      ? Option.some(
          sign(info, entry.chainId).pipe(
            Effect.map(({ address, signature }) => ({
              ...info,
              address,
              chainId: entry.chainId,
              type,
              signatureScheme: scheme,
              signature,
            })),
          ),
        )
      : Option.none()
