import { Data, Effect, Option } from "effect"

import { Info, Proof, SupportedChain } from "./Schema.ts"

export type Prover<R = never> = (
  info: typeof Info.Type,
  entry: typeof SupportedChain.Type,
) => Option.Option<Effect.Effect<typeof Proof.Type, ProverError, R>>

export declare namespace Prover {
  export type Any = Prover<any>
  export type Context<T extends Any> = T extends Prover<infer R> ? R : never
}

export class ProverError extends Data.TaggedError("ProverError")<{
  readonly cause?: unknown
}> {}

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
  }): Prover<R> =>
  (info, entry) =>
    supportsChainId(entry.chainId) &&
    entry.type === type &&
    (entry.signatureScheme === undefined || entry.signatureScheme === scheme)
      ? Option.some(
          sign(info, entry.chainId).pipe(
            Effect.mapError((cause) => new ProverError({ cause })),
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
