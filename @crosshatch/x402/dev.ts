import { serve } from "@hono/node-server"
import { HTTPFacilitatorClient } from "@x402/core/server"
import { ExactEvmScheme } from "@x402/evm/exact/server"
import { paymentMiddleware, x402ResourceServer } from "@x402/hono"
import { Hono } from "hono"
import { cors } from "hono/cors"

const port = 7775

const app = new Hono()
  .use(
    "*",
    cors({
      origin: "https://local.crosshatch.chat",
      allowMethods: ["*"],
      allowHeaders: ["*"],
      exposeHeaders: ["*"],
      credentials: false,
      maxAge: 600,
    }),
  )
  .use(
    paymentMiddleware(
      {
        "GET /": {
          accepts: {
            scheme: "exact",
            price: "$0.01",
            network: "eip155:8453",
            payTo: "0x3A17e24AA721bc8993b643BAbe0C917a5527595a",
          },
          description: "Access to premium content",
        },
      },
      new x402ResourceServer(
        new HTTPFacilitatorClient({
          url: "https://x402.dexter.cash",
        }),
      ).register("eip155:8453", new ExactEvmScheme()),
    ),
  )
  .get("/", (c) => c.text("This content is behind a paywall"))
  .get("/health", (c) => c.text("ok"))

serve({
  fetch: app.fetch,
  port,
}, () => {
  console.log(`@crosshatch/x402 dev server listening on http://localhost:${port}`)
})
