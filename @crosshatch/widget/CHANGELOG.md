# @crosshatch/widget

## 0.0.9

### Patch Changes

- [#160](https://github.com/crosshatch/crosshatch/pull/160)
  [`58defcc`](https://github.com/crosshatch/crosshatch/commit/58defcc1a98241479a71fa02d31f6866bbb1621d) -
  Update package APIs and layer composition for Effect 4 RC. Simplify
  `Payer.layerLocal` to accept an `Accept` function directly and receive
  supported schemes through its Effect layer dependencies.

## 0.0.8

### Patch Changes

- [#154](https://github.com/crosshatch/crosshatch/pull/154)
  [`c6ff6fd`](https://github.com/crosshatch/crosshatch/commit/c6ff6fd8efda5cf458ce110c8fc3f527f0d707d3) -
  Fix import cycles, add missing type-only modifiers, move `Known` back into
  export path.

- [#156](https://github.com/crosshatch/crosshatch/pull/156)
  [`98b994e`](https://github.com/crosshatch/crosshatch/commit/98b994e2d8071ef3a683bc056d3c3a118608bc22) -
  Refactor Widget and Launcher abstractions, with dedicated iframe and popup
  launchers and improved payload, result, and error handling.

- [#157](https://github.com/crosshatch/crosshatch/pull/157)
  [`7f0d32b`](https://github.com/crosshatch/crosshatch/commit/7f0d32b4377fde1223f49f83b892faca040ee58f) -
  Encode widget payloads with string-tree schemas and consistently resolve
  embedded widget URLs against the configured launcher base URL.

## 0.0.7

### Patch Changes

- [#140](https://github.com/crosshatch/crosshatch/pull/140)
  [`31d054b`](https://github.com/crosshatch/crosshatch/commit/31d054bde1102781637320be4d1e9a2c85b76ef7)
  Thanks @harrysolovay! - Continue fleshing out CLI. Add various commands and
  improve mnemonic storage.

- [#152](https://github.com/crosshatch/crosshatch/pull/152)
  [`a12889d`](https://github.com/crosshatch/crosshatch/commit/a12889d053fe5df4c2cc06072583d828d507d80a)
  Thanks @harrysolovay! - Add EURC, JPYC, and XSGD currency support, improve
  Permit2 authorization generation, and standardize layer naming across the API,
  documentation, and examples.

## 0.0.6

### Patch Changes

- [#135](https://github.com/crosshatch/crosshatch/pull/135)
  [`d55f9b1`](https://github.com/crosshatch/crosshatch/commit/d55f9b105c2480ada61b3e19211d8c488be55c18)
  Thanks @harrysolovay! - Extract common functionality into utility package.

## 0.0.5

### Patch Changes

- [#120](https://github.com/crosshatch/crosshatch/pull/120)
  [`13b9e6b`](https://github.com/crosshatch/crosshatch/commit/13b9e6b3e4f5a4d90d04c9dc4dc250228d8cbd47)
  Thanks @harrysolovay! - Fix misaligned effect versions causing installation
  failure.

## 0.0.4

### Patch Changes

- [#114](https://github.com/crosshatch/crosshatch/pull/114)
  [`aca927b`](https://github.com/crosshatch/crosshatch/commit/aca927b0c9f4f1c3b8db83faf8ec7ec1231fb8bd)
  Thanks @harrysolovay! - Implement initial development facilitator command in
  CLI. Swap out Object global usage with Effect Record module.

- [#114](https://github.com/crosshatch/crosshatch/pull/114)
  [`aca927b`](https://github.com/crosshatch/crosshatch/commit/aca927b0c9f4f1c3b8db83faf8ec7ec1231fb8bd)
  Thanks @harrysolovay! - Rename "echo" to "enrichment" in the context of the
  extension API.

## 0.0.3

### Patch Changes

- [#104](https://github.com/crosshatch/crosshatch/pull/104)
  [`3e3fb12`](https://github.com/crosshatch/crosshatch/commit/3e3fb1287e23d71f3354ad850ab6f2379bfc3032)
  Thanks @harrysolovay! - Fix fault second effect version included transiently.

## 0.0.2

### Patch Changes

- [#37](https://github.com/crosshatch/crosshatch/pull/37)
  [`e5d7a7f`](https://github.com/crosshatch/crosshatch/commit/e5d7a7f9fe15e81d1b6eb4bce1756919d24df0a4)
  Thanks @harrysolovay! - Win gar dium levi ohhh sa.
