import { Layer, Config, Effect } from "effect"

import { Erc3009Scheme, Eip155Signer, Permit2Scheme } from "../Eip155/Eip155.ts"
import { SolanaState, SolanaSigner } from "../Solana/Solana.ts"

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
          Effect.map((v) => (v ? SolanaState.layer(v) : Layer.empty)),
          Layer.unwrap,
          Layer.merge(SolanaSigner.layerMnemonic),
        )
      : Layer.empty,
  )
}
