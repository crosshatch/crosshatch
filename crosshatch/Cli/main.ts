#!/usr/bin/env node

import { NodeRuntime, NodeServices, NodeHttpClient } from "@effect/platform-node"
import { Effect, Layer } from "effect"
import { Command } from "effect/unstable/cli"

import * as ChxNodeServices from "../ChxNodeServices/ChxNodeServices.ts"
import { CirqueClient } from "../Cirque/Cirque.ts"
import * as Env from "../Env.ts"
import PackageJson from "../package.json" with { type: "json" }
import { dev } from "./dev/dev.ts"
import { facilitator } from "./facilitator/facilitator.ts"
import { mnemonic } from "./mnemonic/mnemonic.ts"
import { payload } from "./payload/payload.ts"
import { ramp } from "./ramp/ramp.ts"

Command.make("crosshatch").pipe(
  Command.withSubcommands([dev, payload, facilitator, mnemonic, ramp]),
  Command.run({ version: PackageJson.version }),
  Effect.scoped,
  Effect.provide(
    Layer.mergeAll(
      CirqueClient.layer.pipe(Layer.provideMerge([NodeHttpClient.layerFetch, Env.layerFromHostname("crosshatch.dev")])),
      ChxNodeServices.layer.pipe(Layer.provideMerge(NodeServices.layer)),
    ),
  ),
  NodeRuntime.runMain,
)
