# Crosshatch

**An Effect toolkit for composing x402 payments.**

[![npm](https://img.shields.io/npm/v/crosshatch?style=flat-square&color=6D5BD0&label=crosshatch)](https://www.npmjs.com/package/crosshatch)
[![license](https://img.shields.io/badge/license-Apache%202.0-6D5BD0?style=flat-square)](./LICENSE)
[![discord](https://img.shields.io/badge/discord-join-6D5BD0?style=flat-square&logo=discord&logoColor=white)](https://discord.gg/CSXCRUKjh9)

---

## Example Merchant

The following Effect HTTP API route charges and settles USDC on Base.

```ts
import { Facilitator, Required, Payload, Requirements, Http402, KnownAssets } from "crosshatch"
import { Eip155Address } from "crosshatch/Eip155"
import { Effect, Config } from "effect"
import { HttpServerResponse } from "effect/unstable/http"

const recipient = Config.schema(Eip155Address.Eip155Address, "PAY_TO_EIP155")

export default Effect.gen(function* () {
  const payload = yield* Payload.Payload
  if (!payload) {
    const required = yield* Required.make`
    |
    | Description of the charge here.
    |
    | What is this charge for?
    |
    | How does it fit into the current flow?
    |
    `.pipe(
      Required.accept(
        Requirements.asset(KnownAssets.USDC, {
          amount: 0.01,
          recipients: { eip155: { 8453: yield* recipient } },
        }),
      ),
    )
    return yield* Http402.require({ required })
  }
  const settlement = yield* Facilitator.settle({ payload })
  return HttpServerResponse.text("The paid resource.").pipe(Http402.addResponseHeader(settlement))
})
```

- **Payment-aware routes.** Read a parsed x402 payload from the request context and branch between payment required and
  paid-resource responses.
- **Typed charge requirements.** Build the `402 Payment Required` response with Effect config, branded EIP-155
  addresses, accepted assets, recipient chains, and required extensions.
- **Any asset, any chain.** Charge in any asset on any chain without hand-rolling chain IDs, token metadata, or x402
  requirement payloads.
- **Configurable settlement timing.** Settle the submitted payment through the configured facilitator before returning
  the paid resource. Or fork the settlement fiber and return the resource eagerly.
- **Effect HTTP middleware.** Automatic payload parsing and context and extension echo injection with
  `Http402.layerMiddleware`, keeping the route body focused on business logic.

## Contributing

```
git clone --recurse-submodules=konfik git@github.com:crosshatch/crosshatch.git
cd crosshatch
git submodule update --init liminal
git -C liminal submodule update --init konfik

pn i
pn build
pn test
```

Please read the [contributing guide](https://github.com/crosshatch/konfik/blob/main/CONTRIBUTING.md).

## License

Apache-2.0
