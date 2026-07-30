import { Layer, Config, Effect, UndefinedOr } from "effect"

import { Erc3009Scheme, Eip155Signer, Permit2Scheme } from "../Eip155/Eip155.ts"
import * as SolanaScheme from "../Solana/SolanaScheme.ts"
import * as SolanaSigner from "../Solana/SolanaSigner.ts"
import * as SolanaState from "../Solana/SolanaState.ts"

export interface UnifiedSchemesConfig {
  readonly solana?: {
    readonly rpc: string | undefined | Config.Config<string | undefined>
  }
}

export const layer = (config?: UnifiedSchemesConfig) => {
  return Layer.mergeAll(
    Layer.mergeAll(Erc3009Scheme.layer, Permit2Scheme.layer).pipe(Layer.provide(Eip155Signer.layerMnemonic)),
    config?.solana
      ? (Config.isConfig(config.solana.rpc) ? config.solana.rpc : Config.succeed(config.solana.rpc)).pipe(
          Effect.map(
            UndefinedOr.match({
              onDefined: (v) =>
                SolanaScheme.layer.pipe(Layer.provide([SolanaSigner.layerMnemonic, SolanaState.layer(v)])),
              onUndefined: () => Layer.empty,
            }),
          ),
          Layer.unwrap,
        )
      : Layer.empty,
  )
}
