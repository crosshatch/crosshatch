# crosshatch

## 0.0.18

### Patch Changes

- [#170](https://github.com/crosshatch/crosshatch/pull/170)
  [`7c64c39`](https://github.com/crosshatch/crosshatch/commit/7c64c397c21c87f5bc485da872dec1807fe0f646) -
  Add structured extension envelopes, align facilitator API schemas with x402
  responses, and fix Solana transaction construction.

  Add the `PrintableAscii32` schema and remove the `JsonRecord` schema from
  `@crosshatch/util`.

- Updated dependencies
  [[`7c64c39`](https://github.com/crosshatch/crosshatch/commit/7c64c397c21c87f5bc485da872dec1807fe0f646)]:
  - @crosshatch/util@0.0.5

## 0.0.17

### Patch Changes

- [#160](https://github.com/crosshatch/crosshatch/pull/160)
  [`58defcc`](https://github.com/crosshatch/crosshatch/commit/58defcc1a98241479a71fa02d31f6866bbb1621d) -
  Update package APIs and layer composition for Effect 4 RC. Simplify
  `Payer.layerLocal` to accept an `Accept` function directly and receive
  supported schemes through its Effect layer dependencies.
- Updated dependencies
  [[`58defcc`](https://github.com/crosshatch/crosshatch/commit/58defcc1a98241479a71fa02d31f6866bbb1621d)]:
  - @crosshatch/util@0.0.4
  - @crosshatch/widget@0.0.9

## 0.0.16

### Patch Changes

- [#156](https://github.com/crosshatch/crosshatch/pull/156)
  [`98b994e`](https://github.com/crosshatch/crosshatch/commit/98b994e2d8071ef3a683bc056d3c3a118608bc22) -
  Add SHA digest helpers and signed HTTP and WebSocket transports, introduce
  mutable key and CEK refs, and standardize crypto schemas and branding.

- [#156](https://github.com/crosshatch/crosshatch/pull/156)
  [`98b994e`](https://github.com/crosshatch/crosshatch/commit/98b994e2d8071ef3a683bc056d3c3a118608bc22) -
  Rework browser integration around `ChxBrowserRuntime`, `ChxBrowserServices`,
  and namespaced `ChxAtoms`, with typed hosted widgets and injectable allowance
  configuration.

- [#157](https://github.com/crosshatch/crosshatch/pull/157)
  [`7f0d32b`](https://github.com/crosshatch/crosshatch/commit/7f0d32b4377fde1223f49f83b892faca040ee58f) -
  Validate HTTP request body digests during signature verification, improve
  signed WebSocket protocol errors, and update Effect service and layer wiring.

- [#156](https://github.com/crosshatch/crosshatch/pull/156)
  [`98b994e`](https://github.com/crosshatch/crosshatch/commit/98b994e2d8071ef3a683bc056d3c3a118608bc22) -
  Replace the Ramp API and client with a consolidated, stage-aware Cirque API;
  add `AccountId` and return on-ramp URLs as `{ url }`.

- [#154](https://github.com/crosshatch/crosshatch/pull/154)
  [`c6ff6fd`](https://github.com/crosshatch/crosshatch/commit/c6ff6fd8efda5cf458ce110c8fc3f527f0d707d3) -
  Fix import cycles, add missing type-only modifiers, move `Known` back into
  export path.

- [#156](https://github.com/crosshatch/crosshatch/pull/156)
  [`98b994e`](https://github.com/crosshatch/crosshatch/commit/98b994e2d8071ef3a683bc056d3c3a118608bc22) -
  Change `ChxHttp.require` to fail with a typed, HTTP-respondable
  `PaymentRequired` error containing the payment requirements and current trace
  ID.

- [#156](https://github.com/crosshatch/crosshatch/pull/156)
  [`98b994e`](https://github.com/crosshatch/crosshatch/commit/98b994e2d8071ef3a683bc056d3c3a118608bc22) -
  Normalize package subpath entry points and add dedicated `ChxHttp`, `ChxRpc`,
  `Cirque`, and `Dev` imports, replacing superseded root exports.
- Updated dependencies
  [[`98b994e`](https://github.com/crosshatch/crosshatch/commit/98b994e2d8071ef3a683bc056d3c3a118608bc22),
  [`7f0d32b`](https://github.com/crosshatch/crosshatch/commit/7f0d32b4377fde1223f49f83b892faca040ee58f),
  [`98b994e`](https://github.com/crosshatch/crosshatch/commit/98b994e2d8071ef3a683bc056d3c3a118608bc22),
  [`98b994e`](https://github.com/crosshatch/crosshatch/commit/98b994e2d8071ef3a683bc056d3c3a118608bc22),
  [`c6ff6fd`](https://github.com/crosshatch/crosshatch/commit/c6ff6fd8efda5cf458ce110c8fc3f527f0d707d3),
  [`98b994e`](https://github.com/crosshatch/crosshatch/commit/98b994e2d8071ef3a683bc056d3c3a118608bc22),
  [`7f0d32b`](https://github.com/crosshatch/crosshatch/commit/7f0d32b4377fde1223f49f83b892faca040ee58f)]:
  - @crosshatch/util@0.0.3
  - @crosshatch/widget@0.0.8

## 0.0.15

### Patch Changes

- [#140](https://github.com/crosshatch/crosshatch/pull/140)
  [`31d054b`](https://github.com/crosshatch/crosshatch/commit/31d054bde1102781637320be4d1e9a2c85b76ef7)
  Thanks @harrysolovay! - Continue fleshing out CLI. Add various commands and
  improve mnemonic storage.

- [#140](https://github.com/crosshatch/crosshatch/pull/140)
  [`31d054b`](https://github.com/crosshatch/crosshatch/commit/31d054bde1102781637320be4d1e9a2c85b76ef7)
  Thanks @harrysolovay! - Refactor payer composition around `Payer.layerLocal`,
  requirement-selection functions such as `Accept.first`, and denomination
  groups. Rename the built-in asset namespace from `KnownAssets.Usd` to
  `Known.USD`.

- [#152](https://github.com/crosshatch/crosshatch/pull/152)
  [`a12889d`](https://github.com/crosshatch/crosshatch/commit/a12889d053fe5df4c2cc06072583d828d507d80a)
  Thanks @harrysolovay! - Add EURC, JPYC, and XSGD currency support, improve
  Permit2 authorization generation, and standardize layer naming across the API,
  documentation, and examples.
- Updated dependencies
  [[`31d054b`](https://github.com/crosshatch/crosshatch/commit/31d054bde1102781637320be4d1e9a2c85b76ef7),
  [`31d054b`](https://github.com/crosshatch/crosshatch/commit/31d054bde1102781637320be4d1e9a2c85b76ef7),
  [`a12889d`](https://github.com/crosshatch/crosshatch/commit/a12889d053fe5df4c2cc06072583d828d507d80a)]:
  - @crosshatch/widget@0.0.7
  - @crosshatch/util@0.0.2

## 0.0.14

### Patch Changes

- [#135](https://github.com/crosshatch/crosshatch/pull/135)
  [`d55f9b1`](https://github.com/crosshatch/crosshatch/commit/d55f9b105c2480ada61b3e19211d8c488be55c18)
  Thanks @harrysolovay! - Extract common functionality into utility package.

- [#129](https://github.com/crosshatch/crosshatch/pull/129)
  [`a3ac501`](https://github.com/crosshatch/crosshatch/commit/a3ac501ef85a31399b8fd1a199b147fd6de42b70)
  Thanks @harrysolovay! - Add `Payload.isAcceptable` guard.

- Updated dependencies
  [[`d55f9b1`](https://github.com/crosshatch/crosshatch/commit/d55f9b105c2480ada61b3e19211d8c488be55c18)]:
  - @crosshatch/util@0.0.1
  - @crosshatch/widget@0.0.6

## 0.0.13

### Patch Changes

- [#128](https://github.com/crosshatch/crosshatch/pull/128)
  [`1977208`](https://github.com/crosshatch/crosshatch/commit/1977208d9a6b58b2c28fa780ef6c444ce73b56c6)
  Thanks @harrysolovay! - Fix incorrect facilitator endpoint path resolution.

## 0.0.12

### Patch Changes

- [#125](https://github.com/crosshatch/crosshatch/pull/125)
  [`2408f21`](https://github.com/crosshatch/crosshatch/commit/2408f21778a53383194edd86b90bd6f1ef9e2415)
  Thanks @harrysolovay! - Return to mandatory peer deps strategy for now.

## 0.0.11

### Patch Changes

- [#122](https://github.com/crosshatch/crosshatch/pull/122)
  [`c923042`](https://github.com/crosshatch/crosshatch/commit/c92304281ec7e82cfe8c96673c780be0d3bb59dc)
  Thanks @harrysolovay! - Remove viem dependency. Optimize packaging.

## 0.0.10

### Patch Changes

- [#120](https://github.com/crosshatch/crosshatch/pull/120)
  [`13b9e6b`](https://github.com/crosshatch/crosshatch/commit/13b9e6b3e4f5a4d90d04c9dc4dc250228d8cbd47)
  Thanks @harrysolovay! - Fix misaligned effect versions causing installation
  failure.

- Updated dependencies
  [[`13b9e6b`](https://github.com/crosshatch/crosshatch/commit/13b9e6b3e4f5a4d90d04c9dc4dc250228d8cbd47)]:
  - @crosshatch/widget@0.0.5

## 0.0.9

### Patch Changes

- [#118](https://github.com/crosshatch/crosshatch/pull/118)
  [`1cc6c34`](https://github.com/crosshatch/crosshatch/commit/1cc6c341228fac8774612eec6505486a86928cd5)
  Thanks @harrysolovay! - Refactor development mock facilitator.

## 0.0.8

### Patch Changes

- [#109](https://github.com/crosshatch/crosshatch/pull/109)
  [`29d2b27`](https://github.com/crosshatch/crosshatch/commit/29d2b27ef1a6fc4f38bd2e10bc1ac778042fb10e)
  Thanks @harrysolovay! - Disable `<schema>.make` checks at trusted boundaries.

- [#114](https://github.com/crosshatch/crosshatch/pull/114)
  [`aca927b`](https://github.com/crosshatch/crosshatch/commit/aca927b0c9f4f1c3b8db83faf8ec7ec1231fb8bd)
  Thanks @harrysolovay! - Implement initial development facilitator command in
  CLI. Swap out Object global usage with Effect Record module.

- [#87](https://github.com/crosshatch/crosshatch/pull/87)
  [`2691ff5`](https://github.com/crosshatch/crosshatch/commit/2691ff59fc18e16f52b14b7e0589ef39f7fa9947)
  Thanks @saiashirwad! - Align Solana integration with spec and update crypto
  dependencies.

- [#114](https://github.com/crosshatch/crosshatch/pull/114)
  [`aca927b`](https://github.com/crosshatch/crosshatch/commit/aca927b0c9f4f1c3b8db83faf8ec7ec1231fb8bd)
  Thanks @harrysolovay! - Rename "echo" to "enrichment" in the context of the
  extension API.

- Updated dependencies
  [[`aca927b`](https://github.com/crosshatch/crosshatch/commit/aca927b0c9f4f1c3b8db83faf8ec7ec1231fb8bd),
  [`aca927b`](https://github.com/crosshatch/crosshatch/commit/aca927b0c9f4f1c3b8db83faf8ec7ec1231fb8bd)]:
  - @crosshatch/widget@0.0.4

## 0.0.7

### Patch Changes

- [#107](https://github.com/crosshatch/crosshatch/pull/107)
  [`e82aa8c`](https://github.com/crosshatch/crosshatch/commit/e82aa8c17e7dd00fd231650fde6ba0d37aa45824)
  Thanks @harrysolovay! - Introduce `ChxRpc` module for blocking on multiple
  x402 payments over the course of a single handler's execution.

- [#107](https://github.com/crosshatch/crosshatch/pull/107)
  [`e82aa8c`](https://github.com/crosshatch/crosshatch/commit/e82aa8c17e7dd00fd231650fde6ba0d37aa45824)
  Thanks @harrysolovay! - Rename `Http402` module to `ChxHttp`.

## 0.0.6

### Patch Changes

- [#104](https://github.com/crosshatch/crosshatch/pull/104)
  [`3e3fb12`](https://github.com/crosshatch/crosshatch/commit/3e3fb1287e23d71f3354ad850ab6f2379bfc3032)
  Thanks @harrysolovay! - Fix fault second effect version included transiently.

- Updated dependencies
  [[`3e3fb12`](https://github.com/crosshatch/crosshatch/commit/3e3fb1287e23d71f3354ad850ab6f2379bfc3032)]:
  - @crosshatch/widget@0.0.3

## 0.0.5

### Patch Changes

- [#102](https://github.com/crosshatch/crosshatch/pull/102)
  [`c8afbc3`](https://github.com/crosshatch/crosshatch/commit/c8afbc3ceb7c83c647cf0e02dec47e7e3c3e6b97)
  Thanks @harrysolovay! - Refactor physical asset shape, various names of
  `Asset`, and update `KnownAssets` accordingly. Rename `Adapter` to `Scheme`.
  Introduce initial `State` abstraction.

## 0.0.4

### Patch Changes

- [#72](https://github.com/crosshatch/crosshatch/pull/72)
  [`3ffc78b`](https://github.com/crosshatch/crosshatch/commit/3ffc78bd0548085607c868d1a5ed30a8984c4426)
  Thanks @harrysolovay! - Decouple `Bridge` from `Payer`, add client extensions
  API, rename `KnownAsset` -> `KnownAssets`.

- [#84](https://github.com/crosshatch/crosshatch/pull/84)
  [`78c0e24`](https://github.com/crosshatch/crosshatch/commit/78c0e24e50911916d353c47e5ba10d4c9211fe54)
  Thanks @saiashirwad! - Fix unbound schema constructors in crypto helpers

- [#47](https://github.com/crosshatch/crosshatch/pull/47)
  [`4c29a4b`](https://github.com/crosshatch/crosshatch/commit/4c29a4b17ac3d351dd42d1bc2ec3857e2832545a)
  Thanks @harrysolovay! - Introduce Crypto module and begin work on CLI
  (currently unstable).

- [#71](https://github.com/crosshatch/crosshatch/pull/71)
  [`1e1055d`](https://github.com/crosshatch/crosshatch/commit/1e1055d5015330aafd005f41347d951371a82791)
  Thanks @saiashirwad! - Implement Solana adapter.

- [#67](https://github.com/crosshatch/crosshatch/pull/67)
  [`dee259e`](https://github.com/crosshatch/crosshatch/commit/dee259eac8d064093ecc9577eb4ad95a13d8bf66)
  Thanks @harrysolovay! - Generalize amount utils by placing metadata in
  `PhysicalAsset`.

- [#80](https://github.com/crosshatch/crosshatch/pull/80)
  [`8837450`](https://github.com/crosshatch/crosshatch/commit/883745044cf905815ffd676a6d6d0ee28ad46fc2)
  Thanks @harrysolovay! - Rename various evm-specific modules.

- [#70](https://github.com/crosshatch/crosshatch/pull/70)
  [`99b5341`](https://github.com/crosshatch/crosshatch/commit/99b5341530108c095438548bcf27bdbe7b442e3f)
  Thanks @harrysolovay! - Configure otel for CLI. Continue work on http
  integration (specifically fetch / client layers).

- [#86](https://github.com/crosshatch/crosshatch/pull/86)
  [`3899cc1`](https://github.com/crosshatch/crosshatch/commit/3899cc1924c57cdc32b118013535de5bc1327e2e)
  Thanks @saiashirwad! - Use the facilitator-provided fee payer for Solana x402
  payments.

## 0.0.3

### Patch Changes

- [#44](https://github.com/crosshatch/crosshatch/pull/44)
  [`b3482ec`](https://github.com/crosshatch/crosshatch/commit/b3482ece53b2ea68f5e7ab3d7a5505871b834476)
  Thanks @harrysolovay! - Revamp payment required builder.

## 0.0.2

### Patch Changes

- [#37](https://github.com/crosshatch/crosshatch/pull/37)
  [`e5d7a7f`](https://github.com/crosshatch/crosshatch/commit/e5d7a7f9fe15e81d1b6eb4bce1756919d24df0a4)
  Thanks @harrysolovay! - Win gar dium levi ohhh sa.

- Updated dependencies
  [[`e5d7a7f`](https://github.com/crosshatch/crosshatch/commit/e5d7a7f9fe15e81d1b6eb4bce1756919d24df0a4)]:
  - @crosshatch/widget@0.0.2
