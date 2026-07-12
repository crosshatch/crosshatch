<div align="center">

<a href="https://crosshatch.dev">
  <img src="https://placehold.co/600x400" alt="Crosshatch — Effect-native X402 Merchants & Clients" width="360" />
</a>

<br />

[![npm](https://img.shields.io/npm/v/crosshatch?style=flat-square&color=3f5a2a&label=crosshatch)](https://www.npmjs.com/package/crosshatch)
[![license](https://img.shields.io/badge/license-Apache%202.0-3f5a2a?style=flat-square)](./LICENSE)
[![discord](https://img.shields.io/badge/discord-join-3f5a2a?style=flat-square&logo=discord&logoColor=white)](https://discord.gg/CSXCRUKjh9)

**X402-as-Effects** — Effect-native x402 merchants and clients.

[Docs](https://crosshatch.dev) · [Tutorial](https://crosshatch.dev/intro) · [Examples](./examples) ·
[Discord](https://discord.gg/jwKw8dBJdN)

</div>

---

An Effect HTTP API that charges and settles USDC on Base.

```ts
import { Facilitator, Required, Payload, Requirements, Http402, KnownAssets } from "crosshatch"
import { Eip155Address } from "crosshatch/Eip155"
import { PaymentId } from "crosshatch/Extensions"
import { Layer, Effect, Config } from "effect"
import { HttpRouter, HttpServerResponse } from "effect/unstable/http"

export default HttpRouter.add(
  "GET",
  "/paid",
  Effect.gen(function* () {
    const payload = yield* Payload.Payload
    if (!payload) {
      const recipient = yield* Config.schema(Eip155Address.Eip155Address, "PAY_TO_EIP155")
      const required = yield* Required.make`
      |
      | Description of the charge here.
      |
      | What is this charge for?
      |
      | How does it fit into the current flow?
      |
      `.pipe(
        Required.extend(PaymentId.PaymentIdExtension, {
          required: true,
        }),
        Required.accept(
          Requirements.asset(KnownAssets.USDC, {
            amount: 0.01,
            recipients: { eip155: { 8453: recipient } },
          }),
        ),
      )
      return yield* Required.require({ required })
    }
    const settlement = yield* Facilitator.settle({ payload })
    return yield* HttpServerResponse.text("The paid resource.").pipe(Http402.addResponseHeader(settlement))
  }),
).pipe(
  Layer.provide(
    Http402.layerMiddleware({
      extensions: [PaymentId.PaymentIdExtension],
    }),
  ),
  HttpRouter.toHttpEffect,
)
```

- **Payment-aware routes.** Read a parsed x402 payload from the request context and branch between payment required and
  paid-resource responses.
- **Typed charge requirements.** Build the `402 Payment Required` response with Effect config, branded EIP-155
  addresses, accepted assets, recipient chains, and required extensions.
- **USDC on Base.** Accept a specific USDC amount for a Base recipient without hand-rolling chain IDs, token metadata,
  or x402 requirement payloads.
- **Facilitated settlement.** Settle the submitted payment through the configured facilitator before returning the paid
  resource.
- **Effect HTTP middleware.** Add x402 parsing and response headers with `Http402.layerMiddleware`, keeping the route
  body focused on business logic.

```sh
npm i crosshatch@next effect@next
```

> **crosshatch** is in alpha. Expect breaking changes. Come hang in our [Discord](https://discord.gg/jwKw8dBJdN).

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
