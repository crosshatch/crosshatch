import { Effect, Layer, Option } from "effect"

import { Erc3009Scheme, Eip155Signer, Permit2Scheme } from "../namespaces/Eip155/index.ts"
import { SolanaScheme, SolanaSigner, SolanaClient } from "../namespaces/Solana/index.ts"

export const layer = Layer.mergeAll(
  Layer.mergeAll(Erc3009Scheme.layer, Permit2Scheme.layer).pipe(Layer.provide(Eip155Signer.layerFromMnemonic)),
  Effect.serviceOption(SolanaClient.SolanaClient).pipe(
    Effect.map(
      Option.match({
        onSome: (v) =>
          SolanaScheme.layer.pipe(
            Layer.provide([SolanaSigner.layerFromMnemonic, Layer.succeed(SolanaClient.SolanaClient, v)]),
          ),
        onNone: () => Layer.empty,
      }),
    ),
    Layer.unwrap,
  ),
)
