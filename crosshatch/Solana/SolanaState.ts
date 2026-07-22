import { Effect, Layer } from "effect"

import * as State from "../State.ts"
import { Blockhash, getLatestBlockhash } from "./Protocol/Protocol.ts"

export class SolanaState extends State.Service<SolanaState, Blockhash>()("crosshatch/Solana/SolanaState") {}

export const layer = (url: string) =>
  Layer.succeed(SolanaState, {
    getLatestBlockhash: getLatestBlockhash(url).pipe(
      Effect.mapError((cause) => new State.GetLatestBlockhashError({ cause })),
    ),
  })
