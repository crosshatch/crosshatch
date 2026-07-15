import * as Cloudflare from "alchemy/Cloudflare"
import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"
import * as RpcSerialization from "effect/unstable/rpc/RpcSerialization"
import * as RpcServer from "effect/unstable/rpc/RpcServer"

import { Api } from "./Api.ts"

export default class ExampleEffectRpc extends Cloudflare.RpcWorker<ExampleEffectRpc>()(
  "ExampleEffectRpc",
  {
    main: new URL(import.meta.url).pathname,
    schema: Api,
    domain: "example-effect-rpc.crosshatch.dev",
    dev: {
      host: "127.0.0.1",
      port: 4386,
      strictPort: true,
    },
  },
  Effect.gen(function* () {
    const handlers = Api.toLayer({
      buyThing: () => Effect.succeed("The paid resource."),
    })

    return RpcServer.toHttpEffect(Api).pipe(Effect.provide(Layer.mergeAll(handlers, RpcSerialization.layerJson)))
  }),
) {}
