import { Launcher } from "@crosshatch/widget"
import { Effect, Stream, Struct, Option } from "effect"
import { Atom } from "effect/unstable/reactivity"

import * as Amount from "../Amount.ts"
import type { Bridge } from "../index.ts"
import { CurrentAllowance } from "./Allowance.ts"
import * as BrowserServices from "./BrowserServices.ts"
import { CurrentFacadeState } from "./CurrentFacadeState.ts"
import { FacadeClient } from "./FacadeClient.ts"
import { ActivityWidget, LinkWidget } from "./Widgets.ts"

const runtime = Atom.runtime(BrowserServices.layer)

export const stateAtom = runtime
  .subscriptionRef(() => CurrentFacadeState)
  .pipe(Atom.mapResult(Struct.get("session")), Atom.keepAlive)

export const isLinkedAtom = stateAtom.pipe(Atom.mapResult((v) => v._tag === "Linked"))

export const rescindAtom = runtime.fn<void>()(
  Effect.fnUntraced(function* () {
    const facade = yield* FacadeClient
    yield* facade.Rescind()
  }),
)

export const proposeAtom = runtime.fn<Bridge.Proposal>()(
  Effect.fnUntraced(function* (proposal) {
    const facade = yield* FacadeClient
    yield* facade.Propose(proposal)
  }),
)

export const openAtom = runtime.fn<void>()(
  Effect.fnUntraced(function* (_, ctx) {
    const state = yield* ctx.result(stateAtom)
    switch (state._tag) {
      case "Challenged": {
        const { challengeId } = state
        const amount = yield* Amount.from(10)
        const allowance = yield* Effect.serviceOption(CurrentAllowance).pipe(
          Effect.map(
            Option.getOrElse(() => ({
              amount,
              window: "Week" as const,
            })),
          ),
        )
        yield* Launcher.launch(LinkWidget, { challengeId, allowance }).pipe(Stream.runDrain)
        break
      }
      case "Linked": {
        yield* Launcher.launch(ActivityWidget, void 0).pipe(Stream.runDrain)
        break
      }
      case "Rescinded": {
        break
      }
    }
  }),
)
