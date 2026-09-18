import { Eip155, Eip155Signer } from "crosshatch/Cryptocurrency/namespaces/Eip155"
import { USDC } from "crosshatch/Cryptocurrency/token-deployments"
import { Erc3009, Permit2 } from "crosshatch/mechanisms/Eip155"
import { Layer } from "effect"

const instruments = [USDC]

class MySet extends Extension.Service<MySet>()("").pipe(
  ExtensionSet.add(PaymentIdentifier.PaymentIdentifier, {}),
  ExtensionSet.add(PaymentIdentifier.PaymentIdentifier, {}),
) {}

const handlers = ExtensionHandlers.empty.pipe(
  Extension.handle(MySet, {
    h: Effect.fn(function* () {}),
  }),
  Extension.handle(
    PaymentIdentifier.PaymentIdentifier,
    Effect.fn(function* () {
      // ...
    }),
  ),
)

const layerPayer = Payer.layerLocal({ instruments, handlers }).pipe(
  Layer.provide(
    Layer.mergeAll(Erc3009.layer, Permit2.layer).pipe(
      Layer.provide(Eip155Signer.layerFromMnemonic.pipe(Layer.provide(Mnemonic.layerFromConfig("MNEMONIC")))),
    ),
  ),
)

const layerFacilitator = Facilitator.layer({
  baseUrl: "...",
})

export const layerPrelude = Layer.mergeAll(layerExtensionHandlers, layerFacilitator, layerPayer)
