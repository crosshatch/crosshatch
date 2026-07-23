import { Effect, Match, Cause, Struct } from "effect"
import { Atom } from "effect/unstable/reactivity"
import * as Boundary from "@crosshatch/util/Boundary"

import * as Amount from "../Amount.ts"
import { Proposal } from "../Bridge.ts"
import { ChxEnv } from "../ChxEnv.ts"
import * as BrowserServices from "./BrowserServices.ts"
import { FacadeClient } from "./Facade/Facade.ts"
import { FacadeState } from "./Facade/FacadeState.ts"
import { ActivityWidget, IdWidget, LinkWidget } from "./Widgets.ts"

const runtime = Atom.runtime(BrowserServices.layer)

export const stateAtom = runtime
  .subscriptionRef(() => FacadeState)
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

export const proposeAtom = runtime.fn<Proposal>()(
  Effect.fnUntraced(function* (proposal) {
    const facade = yield* FacadeClient
    yield* facade.Propose(proposal)
  }),
)

export const openAtom = runtime.fn<void>()(
  Effect.fnUntraced(function* (_, get) {
    const state = yield* get.result(stateAtom)
    const common = { referrer: location.href }
    const { url } = yield* ChxEnv
    const internal = origin.startsWith(url("link"))
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
