---
"crosshatch": patch
---

Change `ChxHttp.require` to fail with a typed, HTTP-respondable
`PaymentRequired` error containing the payment requirements and current trace
ID.
