# @crosshatch/util

## 0.0.4

### Patch Changes

- [#160](https://github.com/crosshatch/crosshatch/pull/160)
  [`58defcc`](https://github.com/crosshatch/crosshatch/commit/58defcc1a98241479a71fa02d31f6866bbb1621d) -
  Update package APIs and layer composition for Effect 4 RC. Simplify
  `Payer.layerLocal` to accept an `Accept` function directly and receive
  supported schemes through its Effect layer dependencies.

## 0.0.3

### Patch Changes

- [#156](https://github.com/crosshatch/crosshatch/pull/156)
  [`98b994e`](https://github.com/crosshatch/crosshatch/commit/98b994e2d8071ef3a683bc056d3c3a118608bc22) -
  Add shared schema, string, ref, typed HTTP API handler, and WebSocket protocol
  utilities.

- [#157](https://github.com/crosshatch/crosshatch/pull/157)
  [`7f0d32b`](https://github.com/crosshatch/crosshatch/commit/7f0d32b4377fde1223f49f83b892faca040ee58f) -
  Expose WebSocket protocols as a schema-backed Effect service with a standalone
  layer for request-derived protocol access.

- [#156](https://github.com/crosshatch/crosshatch/pull/156)
  [`98b994e`](https://github.com/crosshatch/crosshatch/commit/98b994e2d8071ef3a683bc056d3c3a118608bc22) -
  Publish deployment and documentation helpers from `@crosshatch/alchemy`,
  replacing the former `@crosshatch/util/alchemicals/*` entry points.

- [#156](https://github.com/crosshatch/crosshatch/pull/156)
  [`98b994e`](https://github.com/crosshatch/crosshatch/commit/98b994e2d8071ef3a683bc056d3c3a118608bc22) -
  Add reusable Crosshatch stage and stage-aware domain services, replacing the
  previous `ChxEnv` configuration model.

- [#154](https://github.com/crosshatch/crosshatch/pull/154)
  [`c6ff6fd`](https://github.com/crosshatch/crosshatch/commit/c6ff6fd8efda5cf458ce110c8fc3f527f0d707d3) -
  Fix import cycles, add missing type-only modifiers, move `Known` back into
  export path.

## 0.0.2

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

## 0.0.1

### Patch Changes

- [#135](https://github.com/crosshatch/crosshatch/pull/135)
  [`d55f9b1`](https://github.com/crosshatch/crosshatch/commit/d55f9b105c2480ada61b3e19211d8c488be55c18)
  Thanks @harrysolovay! - Extract common functionality into utility package.
