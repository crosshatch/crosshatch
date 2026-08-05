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
import { ChxHttp } from "crosshatch"
import { Console, Effect, Layer } from "effect"
import { LanguageModel } from "effect/unstable/ai"

import { layerPayer } from "./layerPayer.ts"

const layerLanguageModelBlockrun = OpenAiLanguageModel.layer({
  model: "deepseek/deepseek-chat",
}).pipe(
  Layer.provide(
    OpenAiClient.layer({ apiUrl: "https://blockrun.ai/api/v1" }).pipe(
      Layer.provide(ChxHttp.layerClient.pipe(Layer.provide(layerPayer))),
    ),
  ),
)

LanguageModel.generateText({
  prompt: "Hello from Crosshatch.",
}).pipe(
  Effect.tap(({ text }) => Console.log(text)),
  Effect.provide(layerLanguageModelBlockrun),
  Effect.runFork,
)
```

> Payment capability––`layerPayer`--detailed below.

## Example Merchant

The following Effect HTTP API route charges and settles USD-denominated
stablecoins. It uses [Alchemy](https://github.com/alchemy-run/alchemy)'s
single-file `Cloudflare.Worker` DX, where platform configuration and the Worker
runtime live together.

```ts
import {
  Facilitator,
  Required,
  Payload,
  Requirements,
  ChxHttp,
} from "crosshatch"
import { Eip155Address } from "crosshatch/Eip155"
import * as Known from "crosshatch/Known"
import * as Cloudflare from "alchemy/Cloudflare"
import { Effect, Config, Layer } from "effect"
import { HttpRouter, HttpServerResponse } from "effect/unstable/http"

const recipient = Config.schema(Eip155Address.Eip155Address, "PAY_TO_EIP155")

export default class Merchant extends Cloudflare.Worker<Merchant>()(
  "Merchant",
  { main: import.meta.url },
  Effect.gen(function* () {
    const fetch = HttpRouter.add(
      "GET",
      "/paid",
      Effect.gen(function* () {
        const payload = yield* Payload.Payload
        const accepted = yield* Requirements.denomination(Known.USD, {
          amount: 0.01,
          recipients: { eip155: { 8453: yield* recipient } },
        })
        if (!Payload.isAcceptable(accepted, payload)) {
          const required = yield* Required.make`
          |
          | Description of the charge here.
          |
          | What is this charge for?
          |
          | How does it fit into the current flow?
          |
          `.pipe(Required.accept(accepted))
          return yield* ChxHttp.require({ required })
        }
        const settlement = yield* Facilitator.settle({ payload })
        return HttpServerResponse.text("The paid resource.").pipe(
          ChxHttp.addResponseHeader(settlement),
        )
      }),
    ).pipe(
      Layer.provide([
        HttpRouter.cors({
          allowedHeaders: ["*"],
          allowedMethods: ["*"],
          allowedOrigins: ["*"],
          exposedHeaders: ChxHttp.exposedHeaders,
        }),
        ChxHttp.layerMiddleware(),
        Facilitator.layer(),
      ]),
      HttpRouter.toHttpEffect,
      Effect.scoped,
      Effect.flatten,
    )
    return { fetch }
  }),
) {}
```

## Payer Layer

The following allows the signing payment payloads for various USD-denominated
stablecoins across EVM and Solana chains. Payment capability derived from a
single mnemonic `MNEMONIC` in the environment variables.

`layerPayer.ts`

```ts
import { Accept, Payer, Mnemonic } from "crosshatch"
import * as Known from "crosshatch/Known"
import { UnifiedSchemes } from "crosshatch/Unified"
import { Config, Layer } from "effect"

export const layer = Payer.layerLocal({
  accept: Accept.first(Known),
  schemes: UnifiedSchemes.layer({
    solana: {
      rpc: Config.string("SOLANA_RPC_URL").pipe(Config.withDefault(undefined)),
    },
  }).pipe(Layer.provide(Mnemonic.layerFromEnv)),
})
```

## Contributing

```
git clone --recurse-submodules=konfik git@github.com:crosshatch/crosshatch.git
cd crosshatch
pnpm i
pnpm build
pnpm test
```

Please read the
[contributing guide](https://github.com/crosshatch/konfik/blob/main/CONTRIBUTING.md).

## License

Apache-2.0
