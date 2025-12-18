import type { PaymentRequired } from "@x402/core/types"
import { EnclaveClient } from "crosshatch"
import { Effect } from "effect"

export { fetch_ as fetch }

const fetch_: typeof fetch = (input, init) =>
  Effect.gen(function*() {
    const response = yield* Effect.promise(() => fetch(input, init))

    if (response.status !== 402) return response

    const paymentRequiredHeader = response.headers.get("PAYMENT-REQUIRED")
    console.log(paymentRequiredHeader)
    if (!paymentRequiredHeader) {
      throw 0
    }
    if (!/^[A-Za-z0-9+/]*={0,2}$/.test(paymentRequiredHeader)) {
      throw new Error("Invalid payment required header")
    }

    const enclave = yield* EnclaveClient
    const requirement = JSON.parse(atob(paymentRequiredHeader)) as PaymentRequired
    const { payload } = yield* enclave.payment({ requirement })

    if (init && "__is402Retry" in init) {
      throw new Error("Payment already attempted")
    }

    return yield* Effect.promise(() =>
      fetch(input, {
        ...init,
        headers: {
          ...init?.headers,
          "PAYMENT-SIGNATURE": btoa(JSON.stringify(payload)),
          "Access-Control-Expose-Headers": "PAYMENT-RESPONSE,X-PAYMENT-RESPONSE",
        },
      })
    )
  }).pipe(
    Effect.provide(EnclaveClient.Default),
    Effect.runPromise,
  )
