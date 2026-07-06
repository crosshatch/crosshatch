export const PAYMENT_REQUIRED = "payment-required" as const

export const PAYMENT_SIGNATURE = "payment-signature" as const

export const PAYMENT_RESPONSE = "payment-response" as const

export const CROSSHATCH_TRACE_ID = "x-crosshatch-trace-id" as const

export const EXPOSED_HEADERS = [PAYMENT_REQUIRED, PAYMENT_RESPONSE, CROSSHATCH_TRACE_ID] as const
