import { Amount } from "crosshatch"
import { Effect, Match, Cause } from "effect"
import { Atom } from "effect/unstable/reactivity"
import * as Boundary from "liminal-util/Boundary"

import { Stage } from "../Stage.ts"
import { FacadeClient } from "./Facade/Facade.ts"
import { atomRuntime } from "./runtime.ts"
import { ActivityWidget, IdWidget, LinkWidget } from "./Widgets.ts"

export const stateAtom = atomRuntime.atom(FacadeClient.state).pipe(
  Atom.keepAlive,
  Atom.mapResult(({ status }) => status),
)

export const isLinkedAtom = stateAtom.pipe(Atom.mapResult((v) => v._tag === "Linked"))

export const challengedAtom = atomRuntime.atom((ctx) =>
  ctx.result(stateAtom).pipe(
    Effect.filterOrFail(
      (v) => v._tag === "Challenged",
      () => new Cause.NoSuchElementError(),
    ),
  ),
)

export const rescindAtom = atomRuntime.fn(FacadeClient.fn("Rescind"))

export const proposeAtom = atomRuntime.fn(FacadeClient.fn("Propose"))

export const openAtom = atomRuntime.fn<void>()(
  Effect.fnUntraced(function* (_, get) {
    const state = yield* get.result(stateAtom)
    const common = { referrer: location.href }
    const { url } = yield* Stage
    const internal = origin.startsWith(url())
    yield* Match.valueTags(state, {
      Challenged: ({ challengeId }) =>
        internal
          ? IdWidget.host(common)
          : LinkWidget.host({
              challengeId,
              allowance: {
                amount: Amount.Usd.make(10_000_000n),
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
