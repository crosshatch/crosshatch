import { Stage } from "@crosshatch/util/Stage"
import { Effect, Match, Cause } from "effect"
import { Atom } from "effect/unstable/reactivity"
import * as Boundary from "liminal-util/Boundary"

import * as Facade from "./Facade/Facade.ts"
import { Micros } from "./Micros.ts"
import { atomRuntime } from "./runtime.ts"
import { ActivityWidget, IdWidget, LinkWidget } from "./widgets.ts"

export const stateAtom = atomRuntime.atom(Facade.FacadeClient.state).pipe(
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

export const rescindAtom = atomRuntime.fn(Facade.FacadeClient.fn("Rescind"))

export const proposeAtom = atomRuntime.fn(Facade.FacadeClient.fn("Propose"))

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
                amount: Micros.make(10_000_000n),
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
