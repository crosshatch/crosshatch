import { AccountAddress, ChainIdString } from "@crosshatch/caip"

export interface Asset {
  readonly network: typeof ChainIdString.Type
  readonly asset: typeof AccountAddress.Type
  readonly decimals: number
  readonly extra?: Record<string, unknown> | undefined
}

export const BASE_USDC: Asset = {
  network: ChainIdString.make("eip155:8453"),
  asset: AccountAddress.make("0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"),
  decimals: 6,
  extra: { name: "USD Coin", version: "2" },
}

export const SUPPORTED: ReadonlyArray<Asset> = [BASE_USDC]
