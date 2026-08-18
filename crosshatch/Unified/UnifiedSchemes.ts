import { Effect, Layer, Option } from "effect"

import { Erc3009Scheme, Eip155Signer, Permit2Scheme } from "../Eip155/index.ts"
import { SolanaScheme, SolanaSigner, SolanaState } from "../Solana/index.ts"

export const layer = Layer.mergeAll(
  Layer.mergeAll(Erc3009Scheme.layer, Permit2Scheme.layer).pipe(Layer.provide(Eip155Signer.layerFromMnemonic)),
  Effect.serviceOption(SolanaState.SolanaState).pipe(
    Effect.map(
      Option.match({
        onSome: (v) =>
          SolanaScheme.layer.pipe(
            Layer.provide([SolanaSigner.layerFromMnemonic, Layer.succeed(SolanaState.SolanaState, v)]),
          ),
        onNone: () => Layer.empty,
      }),
    ),
    Layer.unwrap,
  ),
)
