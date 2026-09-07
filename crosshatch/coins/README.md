# Decimals Provenance

Decimals are verified per deployment, identified by namespace, chain reference,
and contract address (case-insensitive for EVM addresses), not by coin symbol or
address alone. The catalog has 81 EVM deployments: 36 have verified decimals and
45 omit the field because their decimals remain unresolved. There are currently
no Solana deployments in this catalog. An omission means unknown, never a
fallback to 6; do not infer decimals from another deployment of the same coin.

The following local source references were checked against each catalog chain
and address before adding decimals:

| Coin    | EVM Chain IDs                                                                                                       | Decimals | Source                                                                                   |
| ------- | ------------------------------------------------------------------------------------------------------------------- | -------- | ---------------------------------------------------------------------------------------- |
| DAI     | 1                                                                                                                   | 18       | [viem metadata test][dai], undeclared-token snapshot; [test client][client] uses mainnet |
| EURC    | 1, 25, 480, 8453, 43114                                                                                             | 6        | [viem EURC definition][eurc]                                                             |
| MEGAUSD | 4326                                                                                                                | 18       | [x402 default assets][x402]                                                              |
| MUSD    | 31612                                                                                                               | 18       | [x402 default assets][x402]                                                              |
| SBC     | 723487                                                                                                              | 6        | [x402 default assets][x402]                                                              |
| USDCE   | 36900, 190415                                                                                                       | 6        | [x402 default assets][x402]                                                              |
| USDC    | 1, 10, 25, 50, 130, 137, 143, 146, 324, 480, 999, 1776, 2818, 8453, 42161, 42220, 43114, 57073, 59144, 81224, 98866 | 6        | [viem USDC definition][usdc]                                                             |
| USDC    | 38833                                                                                                               | 6        | [x402 default assets][x402]                                                              |
| USDT    | 42220                                                                                                               | 6        | [mppx Celo assets][mppx]                                                                 |
| USDT0   | 988                                                                                                                 | 6        | [x402 default assets][x402]                                                              |
| USDT0   | 4217                                                                                                                | 6        | [viem USDT0 definition][usdt0]                                                           |

[dai]: ../../repos/wevm/viem/src/actions/token/getMetadata.test.ts
[client]: ../../repos/wevm/viem/test/src/token.ts
[eurc]: ../../repos/wevm/viem/src/tokens/definitions/eurc.ts
[usdc]: ../../repos/wevm/viem/src/tokens/definitions/usdc.ts
[usdt0]: ../../repos/wevm/viem/src/tokens/definitions/usdt0.ts
[x402]:
  ../../repos/x402-foundation/x402/typescript/packages/mechanisms/evm/src/shared/defaultAssets.ts
[mppx]: ../../repos/wevm/mppx/src/x402/Assets.ts
