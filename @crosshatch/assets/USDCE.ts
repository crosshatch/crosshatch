import { Asset } from "crosshatch"

export const USDCE = Asset.decodeSync([
  {
    address: "0x9cb8142aEBBcdc60AF7c97Af897A67A8f3CA71C2",
    chainId: "eip155:36900",
    decimals: 6,
    name: "USDC.e",
    namespace: "erc20",
    symbol: "USDC.e",
    version: "2",
  },
  {
    address: "0x401eCb1D350407f13ba348573E5630B83638E30D",
    chainId: "eip155:190415",
    decimals: 6,
    name: "Bridged USDC",
    namespace: "erc20",
    symbol: "USDC.e",
    version: "2",
  },
  {
    address: "0x401eCb1D350407f13ba348573E5630B83638E30D",
    chainId: "eip155:181228",
    decimals: 6,
    name: "Bridged USDC",
    namespace: "erc20",
    symbol: "USDC.e",
    version: "2",
  },
])
