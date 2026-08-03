import { Launcher } from "@crosshatch/widget"
import { Effect, Stream, Struct, Option, Match, SubscriptionRef } from "effect"
import { Atom } from "effect/unstable/reactivity"

import * as Amount from "../Amount.ts"
import type { Bridge } from "../index.ts"
import { Allowance } from "./Allowance.ts"
import { memoMap } from "./ChxBrowserRuntime.ts"
import * as BrowserServices from "./ChxBrowserServices.ts"
import { FacadeClient } from "./FacadeClient.ts"
import { FacadeStateRef } from "./FacadeStateRef.ts"
import { ActivityWidget, LinkWidget } from "./Widgets.ts"

export const runtime = Atom.context({ memoMap })(BrowserServices.layer)

export const state = runtime.subscriptionRef(() => FacadeStateRef).pipe(Atom.keepAlive)

export const session = state.pipe(Atom.mapResult(Struct.get("session")))

export const isLinked = session.pipe(Atom.mapResult((v) => v._tag === "Linked"))

export const rescind = runtime.fn<void>()(
  Effect.fnUntraced(function* () {
    const facade = yield* FacadeClient
    yield* facade.Rescind()
  }),
)

export const propose = runtime.fn<Bridge.Proposal>()(
  Effect.fnUntraced(function* (proposal) {
    const facade = yield* FacadeClient
    yield* facade.Propose(proposal)
  }),
)

export const open = runtime.fn<void>()(
  Effect.fnUntraced(function* (_) {
    const { session } = yield* FacadeStateRef.pipe(Effect.flatMap(SubscriptionRef.get))
    yield* Match.valueTags(session, {
      Challenged: ({ challengeId }) =>
        Effect.gen(function* () {
          const amount = yield* Amount.from(10)
          const allowance = yield* Effect.serviceOption(Allowance).pipe(
            Effect.map(Option.getOrElse(() => ({ amount, window: "Week" as const }))),
          )
          yield* Launcher.launch(LinkWidget, { challengeId, allowance }).pipe(Stream.runDrain)
        }),
      Linked: () => Launcher.launch(ActivityWidget, void 0).pipe(Stream.runDrain),
      Rescinded: () => Effect.undefined,
    })
  }),
)
