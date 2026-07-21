import { ChxHttp, Mnemonic } from "crosshatch"
import { Eip155Signer } from "crosshatch/Eip155/Eip155"
import * as Siwx from "crosshatch/Siwx"
import { SolanaSigner } from "crosshatch/Solana/Solana"
import { Layer } from "effect"

import { PayerLive } from "./PayerLive.ts"

export const SiwxHttpClientLive = Layer.mergeAll(
  ChxHttp.layerClient.pipe(Layer.provide(PayerLive)),
  Siwx.Client.layer(Siwx.Siwe.prover, Siwx.Siws.prover).pipe(
    Layer.provide(
      Layer.mergeAll(Eip155Signer.layerMnemonic, SolanaSigner.layerMnemonic).pipe(Layer.provide(Mnemonic.layerEnv)),
    ),
  ),
)
