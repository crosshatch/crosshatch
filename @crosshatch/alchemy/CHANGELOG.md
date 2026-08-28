# @crosshatch/alchemy

## 0.0.15

### Patch Changes

- Updated dependencies
  [[`7c64c39`](https://github.com/crosshatch/crosshatch/commit/7c64c397c21c87f5bc485da872dec1807fe0f646)]:
  - crosshatch@0.0.18

## 0.0.14

### Patch Changes

- [#160](https://github.com/crosshatch/crosshatch/pull/160)
  [`58defcc`](https://github.com/crosshatch/crosshatch/commit/58defcc1a98241479a71fa02d31f6866bbb1621d) -
  Update package APIs and layer composition for Effect 4 RC. Simplify
  `Payer.layerLocal` to accept an `Accept` function directly and receive
  supported schemes through its Effect layer dependencies.
- Updated dependencies
  [[`58defcc`](https://github.com/crosshatch/crosshatch/commit/58defcc1a98241479a71fa02d31f6866bbb1621d)]:
  - crosshatch@0.0.17

## 0.0.13

### Patch Changes

- [#157](https://github.com/crosshatch/crosshatch/pull/157)
  [`7f0d32b`](https://github.com/crosshatch/crosshatch/commit/7f0d32b4377fde1223f49f83b892faca040ee58f) -
  Add an Alchemy-backed Crosshatch stage layer and configure worker domains with
  `www` aliases for production and staging deployments.

- [#156](https://github.com/crosshatch/crosshatch/pull/156)
  [`98b994e`](https://github.com/crosshatch/crosshatch/commit/98b994e2d8071ef3a683bc056d3c3a118608bc22) -
  Publish deployment and documentation helpers from `@crosshatch/alchemy`,
  replacing the former `@crosshatch/util/alchemicals/*` entry points.

- [#154](https://github.com/crosshatch/crosshatch/pull/154)
  [`c6ff6fd`](https://github.com/crosshatch/crosshatch/commit/c6ff6fd8efda5cf458ce110c8fc3f527f0d707d3) -
  Fix import cycles, add missing type-only modifiers, move `Known` back into
  export path.
- Updated dependencies
  [[`98b994e`](https://github.com/crosshatch/crosshatch/commit/98b994e2d8071ef3a683bc056d3c3a118608bc22),
  [`98b994e`](https://github.com/crosshatch/crosshatch/commit/98b994e2d8071ef3a683bc056d3c3a118608bc22),
  [`7f0d32b`](https://github.com/crosshatch/crosshatch/commit/7f0d32b4377fde1223f49f83b892faca040ee58f),
  [`98b994e`](https://github.com/crosshatch/crosshatch/commit/98b994e2d8071ef3a683bc056d3c3a118608bc22),
  [`c6ff6fd`](https://github.com/crosshatch/crosshatch/commit/c6ff6fd8efda5cf458ce110c8fc3f527f0d707d3),
  [`98b994e`](https://github.com/crosshatch/crosshatch/commit/98b994e2d8071ef3a683bc056d3c3a118608bc22),
  [`98b994e`](https://github.com/crosshatch/crosshatch/commit/98b994e2d8071ef3a683bc056d3c3a118608bc22)]:
  - crosshatch@0.0.16

## 0.0.12

### Patch Changes

- [#152](https://github.com/crosshatch/crosshatch/pull/152)
  [`a12889d`](https://github.com/crosshatch/crosshatch/commit/a12889d053fe5df4c2cc06072583d828d507d80a)
  Thanks @harrysolovay! - Add EURC, JPYC, and XSGD currency support, improve
  Permit2 authorization generation, and standardize layer naming across the API,
  documentation, and examples.
- Updated dependencies
  [[`31d054b`](https://github.com/crosshatch/crosshatch/commit/31d054bde1102781637320be4d1e9a2c85b76ef7),
  [`31d054b`](https://github.com/crosshatch/crosshatch/commit/31d054bde1102781637320be4d1e9a2c85b76ef7),
  [`a12889d`](https://github.com/crosshatch/crosshatch/commit/a12889d053fe5df4c2cc06072583d828d507d80a)]:
  - crosshatch@0.0.15

## 0.0.11

### Patch Changes

- [#135](https://github.com/crosshatch/crosshatch/pull/135)
  [`d55f9b1`](https://github.com/crosshatch/crosshatch/commit/d55f9b105c2480ada61b3e19211d8c488be55c18)
  Thanks @harrysolovay! - Extract common functionality into utility package.

- Updated dependencies
  [[`d55f9b1`](https://github.com/crosshatch/crosshatch/commit/d55f9b105c2480ada61b3e19211d8c488be55c18),
  [`a3ac501`](https://github.com/crosshatch/crosshatch/commit/a3ac501ef85a31399b8fd1a199b147fd6de42b70)]:
  - crosshatch@0.0.14

## 0.0.10

### Patch Changes

- Updated dependencies
  [[`1977208`](https://github.com/crosshatch/crosshatch/commit/1977208d9a6b58b2c28fa780ef6c444ce73b56c6)]:
  - crosshatch@0.0.13

## 0.0.9

### Patch Changes

- Updated dependencies
  [[`2408f21`](https://github.com/crosshatch/crosshatch/commit/2408f21778a53383194edd86b90bd6f1ef9e2415)]:
  - crosshatch@0.0.12

## 0.0.8

### Patch Changes

- Updated dependencies
  [[`c923042`](https://github.com/crosshatch/crosshatch/commit/c92304281ec7e82cfe8c96673c780be0d3bb59dc)]:
  - crosshatch@0.0.11

## 0.0.7

### Patch Changes

- [#120](https://github.com/crosshatch/crosshatch/pull/120)
  [`13b9e6b`](https://github.com/crosshatch/crosshatch/commit/13b9e6b3e4f5a4d90d04c9dc4dc250228d8cbd47)
  Thanks @harrysolovay! - Fix misaligned effect versions causing installation
  failure.

- Updated dependencies
  [[`13b9e6b`](https://github.com/crosshatch/crosshatch/commit/13b9e6b3e4f5a4d90d04c9dc4dc250228d8cbd47)]:
  - crosshatch@0.0.10

## 0.0.6

### Patch Changes

- Updated dependencies
  [[`1cc6c34`](https://github.com/crosshatch/crosshatch/commit/1cc6c341228fac8774612eec6505486a86928cd5)]:
  - crosshatch@0.0.9

## 0.0.5

### Patch Changes

- Updated dependencies
  [[`29d2b27`](https://github.com/crosshatch/crosshatch/commit/29d2b27ef1a6fc4f38bd2e10bc1ac778042fb10e),
  [`aca927b`](https://github.com/crosshatch/crosshatch/commit/aca927b0c9f4f1c3b8db83faf8ec7ec1231fb8bd),
  [`2691ff5`](https://github.com/crosshatch/crosshatch/commit/2691ff59fc18e16f52b14b7e0589ef39f7fa9947),
  [`aca927b`](https://github.com/crosshatch/crosshatch/commit/aca927b0c9f4f1c3b8db83faf8ec7ec1231fb8bd)]:
  - crosshatch@0.0.8

## 0.0.4

### Patch Changes

- Updated dependencies
  [[`e82aa8c`](https://github.com/crosshatch/crosshatch/commit/e82aa8c17e7dd00fd231650fde6ba0d37aa45824),
  [`e82aa8c`](https://github.com/crosshatch/crosshatch/commit/e82aa8c17e7dd00fd231650fde6ba0d37aa45824)]:
  - crosshatch@0.0.7

## 0.0.3

### Patch Changes

- [#104](https://github.com/crosshatch/crosshatch/pull/104)
  [`3e3fb12`](https://github.com/crosshatch/crosshatch/commit/3e3fb1287e23d71f3354ad850ab6f2379bfc3032)
  Thanks @harrysolovay! - Fix fault second effect version included transiently.

- Updated dependencies
  [[`3e3fb12`](https://github.com/crosshatch/crosshatch/commit/3e3fb1287e23d71f3354ad850ab6f2379bfc3032)]:
  - crosshatch@0.0.6

## 0.0.2

### Patch Changes

- Updated dependencies
  [[`c8afbc3`](https://github.com/crosshatch/crosshatch/commit/c8afbc3ceb7c83c647cf0e02dec47e7e3c3e6b97)]:
  - crosshatch@0.0.5

## 0.0.1

### Patch Changes

- Updated dependencies
  [[`3ffc78b`](https://github.com/crosshatch/crosshatch/commit/3ffc78bd0548085607c868d1a5ed30a8984c4426),
  [`78c0e24`](https://github.com/crosshatch/crosshatch/commit/78c0e24e50911916d353c47e5ba10d4c9211fe54),
  [`4c29a4b`](https://github.com/crosshatch/crosshatch/commit/4c29a4b17ac3d351dd42d1bc2ec3857e2832545a),
  [`1e1055d`](https://github.com/crosshatch/crosshatch/commit/1e1055d5015330aafd005f41347d951371a82791),
  [`dee259e`](https://github.com/crosshatch/crosshatch/commit/dee259eac8d064093ecc9577eb4ad95a13d8bf66),
  [`8837450`](https://github.com/crosshatch/crosshatch/commit/883745044cf905815ffd676a6d6d0ee28ad46fc2),
  [`99b5341`](https://github.com/crosshatch/crosshatch/commit/99b5341530108c095438548bcf27bdbe7b442e3f),
  [`3899cc1`](https://github.com/crosshatch/crosshatch/commit/3899cc1924c57cdc32b118013535de5bc1327e2e)]:
  - crosshatch@0.0.4
