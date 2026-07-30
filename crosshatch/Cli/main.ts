#!/usr/bin/env node

import { NodeRuntime, NodeServices, NodeHttpClient } from "@effect/platform-node"
import { Effect, Layer } from "effect"
import { Command } from "effect/unstable/cli"

import { HostMnemonicStore, HostUserConfig } from "../Host/Host.ts"
import PackageJson from "../package.json" with { type: "json" }
import { RampClient } from "../Ramp/Ramp.ts"
import { dev } from "./dev/dev.ts"
import { facilitator } from "./facilitator/facilitator.ts"
import { mnemonic } from "./mnemonic/mnemonic.ts"
import { payload } from "./payload/payload.ts"
import { ramp } from "./ramp/ramp.ts"

Command.make("crosshatch").pipe(
  Command.withSubcommands([dev, payload, facilitator, mnemonic, ramp]),
  Command.run({ version: PackageJson.version }),
  Effect.scoped,
  Effect.provide([
    RampClient.layer.pipe(Layer.provideMerge(NodeHttpClient.layerFetch)),
    HostMnemonicStore.layer.pipe(Layer.provide(HostUserConfig.layer)),
  ]),
  Effect.provide(NodeServices.layer),
  NodeRuntime.runMain,
)
