import { assert, describe, it } from "@effect/vitest"
import { Effect, Encoding, Layer, ManagedRuntime } from "effect"

import * as Payer from "../Payer.ts"
import { makeFetch } from "./makeFetch.ts"

const ACCEPTS = {
  amount: "1000",
  asset: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  maxTimeoutSeconds: 300,
  network: "eip155:8453",
  payTo: "0x1111111111111111111111111111111111111111",
  scheme: "exact",
}

const required = (x402Version: 1 | 2) => ({
  accepts: [ACCEPTS],
  resource: {},
  x402Version,
})

const runtime = ManagedRuntime.make(
  Layer.succeed(Payer.Payer, {
    createPayload: ({ required }) =>
      Effect.succeed({
        payload: {
          x402Version: required.x402Version,
          accepted: required.accepts[0]!,
          payload: { signature: "0xsigned" },
        },
      }),
  }),
)

const stubFetch = (
  ...responses: ReadonlyArray<(init?: RequestInit) => Response>
): { calls: RequestInit[] } & typeof globalThis.fetch => {
  const calls: RequestInit[] = []
  return Object.assign(
    async (_input: RequestInfo | URL, init?: RequestInit) => {
      calls.push(init ?? {})
      return responses[calls.length - 1]!(init)
    },
    { calls },
  )
}

describe(import.meta.url, () => {
  it("passes non-402 responses through untouched", async () => {
    const fetch = stubFetch(() => new Response("ok", { status: 200 }))
    const response = await makeFetch(runtime, fetch)("https://example.com")
    assert.strictEqual(response.status, 200)
    assert.strictEqual(await response.text(), "ok")
    assert.strictEqual(fetch.calls.length, 1)
  })

  it("retries a v2 402 with a PAYMENT-SIGNATURE header", async () => {
    const header = Encoding.encodeBase64(JSON.stringify(required(2)))
    const fetch = stubFetch(
      () => new Response(null, { status: 402, headers: { "PAYMENT-REQUIRED": header } }),
      () => new Response("paid", { status: 200 }),
    )
    const response = await makeFetch(runtime, fetch)("https://example.com")
    assert.strictEqual(response.status, 200)
    assert.strictEqual(fetch.calls.length, 2)
    const retry = new Headers(fetch.calls[1]!.headers)
    const payload = JSON.parse(atob(retry.get("PAYMENT-SIGNATURE")!))
    assert.strictEqual(payload.x402Version, 2)
    assert.deepStrictEqual(payload.payload, { signature: "0xsigned" })
    assert.isNull(retry.get("X-PAYMENT"))
  })

  it("retries a v1 402 body with an X-PAYMENT header", async () => {
    const fetch = stubFetch(
      () => Response.json(required(1), { status: 402 }),
      () => new Response("paid", { status: 200 }),
    )
    const response = await makeFetch(runtime, fetch)("https://example.com")
    assert.strictEqual(response.status, 200)
    assert.strictEqual(fetch.calls.length, 2)
    const retry = new Headers(fetch.calls[1]!.headers)
    const payload = JSON.parse(atob(retry.get("X-PAYMENT")!))
    assert.strictEqual(payload.x402Version, 1)
    assert.isNull(retry.get("PAYMENT-SIGNATURE"))
  })
})
