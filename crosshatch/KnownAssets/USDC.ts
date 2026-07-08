import { EvmAsset } from "../Evm/Evm.ts"
import { Eip3009Adapter } from "../payload_adapters/Erc3009.ts"
import { type PhysicalAsset } from "../PhysicalAsset.ts"

export const USDC = {
  peg: "USD",
  symbol: "USDC",
  deployments: {
    eip155: {
      50: {
        asset: EvmAsset.EvmAsset.make("0xfA2958CB79b0491CC627c1557F441eF849Ca8eb1"),
        decimals: 6,
        name: "USDC",
        version: "2",
        adapters: [Eip3009Adapter],
      },
      51: {
        asset: EvmAsset.EvmAsset.make("0xb5AB69F7bBada22B28e79C8FFAECe55eF1c771D4"),
        decimals: 6,
        name: "USDC",
        version: "2",
        adapters: [Eip3009Adapter],
      },
      137: {
        asset: EvmAsset.EvmAsset.make("0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359"),
        decimals: 6,
        name: "USD Coin",
        version: "2",
        adapters: [Eip3009Adapter],
      },
      143: {
        asset: EvmAsset.EvmAsset.make("0x754704Bc059F8C67012fEd69BC8A327a5aafb603"),
        decimals: 6,
        name: "USD Coin",
        version: "2",
        adapters: [Eip3009Adapter],
      },
      8453: {
        asset: EvmAsset.EvmAsset.make("0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"),
        decimals: 6,
        name: "USD Coin",
        version: "2",
        adapters: [Eip3009Adapter],
      },
      42161: {
        asset: EvmAsset.EvmAsset.make("0xaf88d065e77c8cC2239327C5EDb3A432268e5831"),
        decimals: 6,
        name: "USD Coin",
        version: "2",
        adapters: [Eip3009Adapter],
      },
      421614: {
        asset: EvmAsset.EvmAsset.make("0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d"),
        decimals: 6,
        name: "USD Coin",
        version: "2",
        adapters: [Eip3009Adapter],
      },
      84532: {
        asset: EvmAsset.EvmAsset.make("0x036CbD53842c5426634e7929541eC2318f3dCF7e"),
        decimals: 6,
        name: "USDC",
        version: "2",
        adapters: [Eip3009Adapter],
      },
    },
  },
} as const satisfies PhysicalAsset
