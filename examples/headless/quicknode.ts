import { ChxHttp, Mnemonic } from "crosshatch"
import { Eip155Signer } from "crosshatch/Eip155"
import * as Siwx from "crosshatch/Siwx"
import { Console, Effect, Layer } from "effect"
import { FetchHttpClient, HttpClient, HttpClientRequest } from "effect/unstable/http"

const Live = ChxHttp.layerClient(Siwx.Client.resolver(Siwx.Siwe.prover)).pipe(
  Layer.provide([FetchHttpClient.layer, Eip155Signer.layerMnemonic.pipe(Layer.provide(Mnemonic.layerEnv))]),
)

Effect.gen(function* () {
  const request = yield* HttpClientRequest.bodyJson(HttpClientRequest.post("https://x402.quicknode.com/base-sepolia"), {
    jsonrpc: "2.0",
    id: 1,
    method: "eth_blockNumber",
    params: [],
  })
  const first = yield* HttpClient.execute(request)
  const second = yield* HttpClient.execute(request)
  yield* Console.log({
    first: {
      status: first.status,
      paid: first.headers[ChxHttp.PAYMENT_RESPONSE] !== undefined,
    },
    second: {
      status: second.status,
      paid: second.headers[ChxHttp.PAYMENT_RESPONSE] !== undefined,
    },
  })
}).pipe(Effect.provide(Live), Effect.runFork)
