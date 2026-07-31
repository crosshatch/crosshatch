import * as Boundary from "@crosshatch/util/Boundary"
import { Effect, Match, Cause, Struct } from "effect"
import { Atom } from "effect/unstable/reactivity"

import { Amount, type Bridge, Env } from "../index.ts"
import * as BrowserServices from "./BrowserServices.ts"
import { CurrentFacadeState } from "./CurrentFacadeState.ts"
import { FacadeClient } from "./FacadeClient.ts"
import { ActivityWidget, IdWidget, LinkWidget } from "./Widgets.ts"

const runtime = Atom.runtime(BrowserServices.layer)

export const stateAtom = runtime
  .subscriptionRef(() => CurrentFacadeState)
  .pipe(Atom.mapResult(Struct.get("session")), Atom.keepAlive)

export const isLinkedAtom = stateAtom.pipe(Atom.mapResult((v) => v._tag === "Linked"))

export const challengedAtom = runtime.atom((ctx) =>
  ctx.result(stateAtom).pipe(
    Effect.filterOrFail(
      (v) => v._tag === "Challenged",
      () => new Cause.NoSuchElementError(),
    ),
  ),
)

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
  Effect.fnUntraced(function* (_, get) {
    const state = yield* get.result(stateAtom)
    const common = { referrer: location.href }
    const { url } = yield* Env.Env
    const internal = origin.startsWith(url({ sub: "link" }))
    const amount = yield* Amount.from(10)
    yield* Match.valueTags(state, {
      Challenged: ({ challengeId }) =>
        internal
          ? IdWidget.host(common)
          : LinkWidget.host({
              challengeId,
              allowance: {
                amount,
                window: "Week",
              },
              ...common,
            }),
      Linked: () => ActivityWidget.host(common),
      Rescinded: Effect.die,
    }).pipe(
      Boundary.span("open", import.meta.url, {
        attributes: { stateTag: state._tag, internal },
      }),
    )
  }),
)
