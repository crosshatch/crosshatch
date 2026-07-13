# Crosshatch

**An Effect toolkit for composing x402 payments.**

[![npm](https://img.shields.io/npm/v/crosshatch?style=flat-square&color=6D5BD0&label=crosshatch)](https://www.npmjs.com/package/crosshatch)
[![license](https://img.shields.io/badge/license-Apache%202.0-6D5BD0?style=flat-square)](./LICENSE)
[![discord](https://img.shields.io/badge/discord-join-6D5BD0?style=flat-square&logo=discord&logoColor=white)](https://discord.gg/CSXCRUKjh9)

---

## Example AI Client

The following Effect language model uses accountless x402 to generate a
completion.

```ts
import { OpenAiClient, OpenAiLanguageModel } from "@effect/ai-openai-compat"
import { Http402 } from "crosshatch"
import { Console, Effect, Layer } from "effect"
import { LanguageModel } from "effect/unstable/ai"

import { PayerLive } from "./PayerLive.ts"

const BlockrunLive = OpenAiLanguageModel.layer({
  model: "deepseek/deepseek-chat",
}).pipe(
  Layer.provide(OpenAiClient.layer({ apiUrl: "https://blockrun.ai/api/v1" })),
)

LanguageModel.generateText({
  prompt: "Hello from Crosshatch.",
}).pipe(
  Effect.tap(({ text }) => Console.log(text)),
  Effect.provide(
    BlockrunLive.pipe(
      Layer.provide(Http402.layerClient.pipe(Layer.provide(PayerLive))),
    ),
  ),
  Effect.runFork,
)
```

> Payment capability––`PayerLive`--detailed below.

## Example Merchant

The following Effect HTTP API route charges and settles USDC on Base.

```ts
import {
  Facilitator,
  Required,
  Payload,
  Requirements,
  Http402,
  KnownAssets,
} from "crosshatch"
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
  return HttpServerResponse.text("The paid resource.").pipe(
    Http402.addResponseHeader(settlement),
  )
})
```

## Payer Layer

The following allows the signing payment payloads for various USD-denominated
stablecoins across EVM and Solana chains. Payment capability derived from a
single mnemonic `MNEMONIC` in the environment variables.

`PayerLive.ts`

```ts
import { Accept, KnownAssets, Mnemonic, Payer } from "crosshatch"
import { Erc3009, Eip155Signer, Permit2 } from "crosshatch/Eip155"
import { Layer } from "effect"

export const PayerLive = Payer.layer.pipe(
  Layer.provide(
    Accept.layer(KnownAssets).pipe(
      Layer.provide(
        Layer.mergeAll(Erc3009.layer, Permit2.layer).pipe(
          Layer.provide(
            Eip155Signer.layerMnemonic.pipe(Layer.provide(Mnemonic.layerEnv)),
          ),
        ),
      ),
    ),
  ),
)
```

## Contributing

```
git clone --recurse-submodules=konfik git@github.com:crosshatch/crosshatch.git
cd crosshatch
git submodule update --init liminal
git -C liminal submodule update --init konfik

pnpm i
pnpm build
pnpm test
```

Please read the
[contributing guide](https://github.com/crosshatch/konfik/blob/main/CONTRIBUTING.md).

## License

Apache-2.0
