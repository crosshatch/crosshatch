export { fetch_ as fetch }
const fetch_: typeof fetch = (input, init) => {
  const headers = new Headers(init?.headers)
  headers.delete("traceparent")
  headers.delete("tracestate")
  headers.delete("b3")
  headers.delete("x-b3-traceid")
  headers.delete("x-b3-spanid")
  headers.delete("x-b3-sampled")
  headers.delete("http-referrer")
  return fetch(input, { ...init, headers })
}

// import type { PaymentRequired } from "@x402/core/types"
// import { Effect } from "effect"
// import { CrosshatchRuntime } from "./CrosshatchRuntime.ts"
// import { EnclaveClient } from "./EnclaveClient.ts"
//
// export { fetch_ as fetch }
// const fetch_: typeof fetch = async (input, init) =>
//   Effect.gen(function*() {
//     const response = yield* Effect.promise(() => fetch(input, init))

//     if (response.status !== 402) {
//       return response
//     }

//     let requirement: PaymentRequired
//     const requirementHeader = response.headers.get("PAYMENT-REQUIRED")
//     if (requirementHeader) {
//       requirement = JSON.parse(atob(requirementHeader))
//     } else {
//       const body = yield* Effect.tryPromise({
//         try: () => response.json() as Promise<PaymentRequired>,
//         catch: () => undefined,
//       })
//       if (typeof body === "object" && body !== null && "x402Version" in body && body.x402Version === 1) {
//         requirement = body as PaymentRequired
//       } else throw 0
//     }

//     const enclave = yield* EnclaveClient
//     const { payload } = yield* enclave.payment({ requirement })

//     // TODO: remove
//     if (true as boolean) {
//       return new Response()
//     }

//     const value = btoa(JSON.stringify(payload))
//     const paymentHeaders = yield* Effect.fromNullable(
//       {
//         1: { "X-PAYMENT": value },
//         2: { "PAYMENT-SIGNATURE": value },
//       }[payload.x402Version],
//     )

//     const newInit = {
//       ...init,
//       headers: {
//         ...init?.headers,
//         ...paymentHeaders,
//         "Access-Control-Expose-Headers": "PAYMENT-RESPONSE,X-PAYMENT-RESPONSE",
//       },
//     }

//     return yield* Effect.promise(() => fetch(input, newInit))
//   }).pipe((x) =>
//     CrosshatchRuntime.runPromise(x, {
//       signal: init?.signal ?? undefined,
//     })
//   )
