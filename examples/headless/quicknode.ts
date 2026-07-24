import { ChxHttp } from "crosshatch"
import { Console, Effect } from "effect"
import { HttpClient, HttpClientRequest } from "effect/unstable/http"

import { SiwxHttpClientLive } from "./SiwxHttpClientLive.ts"

Effect.gen(function* () {
  const request = yield* HttpClientRequest.bodyJson(HttpClientRequest.post("https://x402.quicknode.com/base-sepolia"), {
    jsonrpc: "2.0",
    id: 1,
    method: "eth_blockNumber",
    params: [],
  })
  const response = yield* HttpClient.execute(request)
  yield* Console.log({
    status: response.status,
    paid: response.headers[ChxHttp.PAYMENT_RESPONSE],
  })
}).pipe(Effect.provide(SiwxHttpClientLive), Effect.runFork)
