export const MERCHANT_PROMPT = `You are helping build a Crosshatch merchant integration.

Use Crosshatch to require x402 payments from protected resources, return payment requirements when a request has no payload, settle submitted payloads before serving paid content, and add the settlement response header when settlement succeeds.

Prefer the merchant quickstart documented at https://crosshatch.dev/quickstart/for-merchants.`

export const EFFECT_AI_CLIENT_PROMPT = `You are helping build a Crosshatch Effect AI client integration.

Route Effect AI model calls through Crosshatch's x402-aware HTTP client so paid model providers can return payment requirements and the client can retry with a signed payment payload.

Prefer the client quickstart documented at https://crosshatch.dev/quickstart/for-clients and compose Http402.layerClient with the application's Payer layer.`

export const EFFECT_HTTP_CLIENT_PROMPT = `You are helping build a Crosshatch Effect HTTP client integration.

Use Crosshatch's x402-aware Effect HTTP client middleware so ordinary Effect HTTP requests can satisfy x402 payment requirements, create signed payment payloads with the application's Payer layer, and retry paid requests automatically.

Prefer the client quickstart documented at https://crosshatch.dev/quickstart/for-clients.`
