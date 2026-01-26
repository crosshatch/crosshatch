import { Config, Effect, Redacted, Schema as S } from "effect"
import { createPublicClient, erc20Abi, http } from "viem"
import * as chains from "viem/chains"
import { EvmAddress } from "./Address.ts"
import { Asset } from "./Asset.ts"
import type { ChainId } from "./ChainId.ts"
import { Derivation } from "./Derivation.ts"

export const get = Effect.fn(function*(
  derivation: typeof Derivation.Type,
  asset: typeof Asset.Type,
) {
  const proxyUrl = yield* Config.redacted("EVM_PROXY_URL")
  const client = createPublicClient({
    chain: getEvmChain(derivation.chainId),
    transport: http(Redacted.value(proxyUrl)),
  })
  const asset_ = yield* S.decodeUnknown(EvmAddress)(asset)
  const address = yield* S.decodeUnknown(EvmAddress)(derivation.address)
  return yield* Effect.tryPromise(() =>
    client.readContract({
      address: asset_,
      abi: erc20Abi,
      functionName: "balanceOf",
      args: [address],
    })
  )
})

const getEvmChain = (chainId: typeof ChainId.Type) => ({
  8453: chains.base,
  84532: chains.baseSepolia,
  42161: chains.arbitrum,
  1: chains.mainnet,
  10: chains.optimism,
  137: chains.polygon,
}[chainId])
