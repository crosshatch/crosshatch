import { Effect, Layer } from "effect"
import { FetchHttpClient, HttpClient, HttpClientRequest } from "effect/unstable/http"

import * as State from "../State.ts"
import { Blockhash, getLatestBlockhash } from "./Protocol/Protocol.ts"

export class SolanaState extends State.Service<SolanaState, Blockhash>()("crosshatch/Solana/SolanaState") {}

export const layer = (url: string) =>
  Layer.effect(
    SolanaState,
    HttpClient.HttpClient.pipe(
      Effect.map((client) => HttpClient.mapRequest(client, HttpClientRequest.prependUrl(url))),
      Effect.map((client) => ({
        getLatestBlockhash: getLatestBlockhash.pipe(
          Effect.provideService(HttpClient.HttpClient, client),
          Effect.mapError((cause) => new State.GetLatestBlockhashError({ cause })),
        ),
      })),
    ),
  ).pipe(Layer.provide(FetchHttpClient.layer))
