import { Effect, Match, Cause, Struct } from "effect"
import { Atom } from "effect/unstable/reactivity"
import * as Boundary from "liminal-util/Boundary"

import * as Amount from "../Amount.ts"
import { Stage } from "../Stage.ts"
import * as BrowserPayer from "./BrowserPayer.ts"
import { FacadeClient } from "./Facade/Facade.ts"
import { ActivityWidget, IdWidget, LinkWidget } from "./Widgets.ts"

const runtime = Atom.runtime(BrowserPayer.layer)

export const stateAtom = runtime.atom(FacadeClient.state).pipe(Atom.keepAlive, Atom.mapResult(Struct.get("status")))

export const isLinkedAtom = stateAtom.pipe(Atom.mapResult((v) => v._tag === "Linked"))

export const challengedAtom = runtime.atom((ctx) =>
  ctx.result(stateAtom).pipe(
    Effect.filterOrFail(
      (v) => v._tag === "Challenged",
      () => new Cause.NoSuchElementError(),
    ),
  ),
)

export const rescindAtom = runtime.fn(FacadeClient.fn("Rescind"))

export const proposeAtom = runtime.fn(FacadeClient.fn("Propose"))

export const openAtom = runtime.fn<void>()(
  Effect.fnUntraced(function* (_, get) {
    const state = yield* get.result(stateAtom)
    const common = { referrer: location.href }
    const { url } = yield* Stage
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
    }).pipe(
      Boundary.span("open", import.meta.url, {
        attributes: { stateTag: state._tag, internal },
      }),
    )
  }),
)
