import { AccountAddress } from "@crosshatch/caip"
import { Asset } from "crosshatch"

export const USDC = {
  eip155: {
    50: {
      address: AccountAddress.make("0xfA2958CB79b0491CC627c1557F441eF849Ca8eb1"),
      assetNamespace: "erc20",
      decimals: 6,
      name: "USDC",
      symbol: "USDC",
      version: "2",
    },
    51: {
      address: AccountAddress.make("0xb5AB69F7bBada22B28e79C8FFAECe55eF1c771D4"),
      assetNamespace: "erc20",
      decimals: 6,
      name: "USDC",
      symbol: "USDC",
      version: "2",
    },
    137: {
      address: AccountAddress.make("0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359"),
      assetNamespace: "erc20",
      decimals: 6,
      name: "USD Coin",
      symbol: "USDC",
      version: "2",
    },
    143: {
      address: AccountAddress.make("0x754704Bc059F8C67012fEd69BC8A327a5aafb603"),
      assetNamespace: "erc20",
      decimals: 6,
      name: "USD Coin",
      symbol: "USDC",
      version: "2",
    },
    8453: {
      address: AccountAddress.make("0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"),
      assetNamespace: "erc20",
      decimals: 6,
      name: "USD Coin",
      symbol: "USDC",
      version: "2",
    },
    42161: {
      address: AccountAddress.make("0xaf88d065e77c8cC2239327C5EDb3A432268e5831"),
      assetNamespace: "erc20",
      decimals: 6,
      name: "USD Coin",
      symbol: "USDC",
      version: "2",
    },
    421614: {
      address: AccountAddress.make("0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d"),
      assetNamespace: "erc20",
      decimals: 6,
      name: "USD Coin",
      symbol: "USDC",
      version: "2",
    },
    84532: {
      address: AccountAddress.make("0x036CbD53842c5426634e7929541eC2318f3dCF7e"),
      assetNamespace: "erc20",
      decimals: 6,
      name: "USDC",
      symbol: "USDC",
      version: "2",
    },
  },
} as const satisfies Asset.Asset
