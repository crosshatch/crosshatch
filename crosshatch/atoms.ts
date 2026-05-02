import { Effect, Match, Cause } from "effect"
import { Atom } from "effect/unstable/reactivity"

import * as Facade from "./Facade/Facade.ts"
import { InternalEnv } from "./InternalEnv.ts"
import { Micros } from "./Micros.ts"
import { atomRuntime } from "./runtime.ts"
import { EventsWidget, IdWidget, LinkWidget } from "./widgets.ts"

export const stateAtom = atomRuntime.atom(Facade.FacadeState.FacadeState.stream)

export const isLinkedAtom = stateAtom.pipe(Atom.mapResult((v) => v._tag === "Linked"))

export const challengedAtom = atomRuntime.atom((ctx) =>
  ctx.result(stateAtom).pipe(
    Effect.filterOrFail(
      (v) => v._tag === "Challenged",
      () => new Cause.NoSuchElementError(),
    ),
  ),
)

export const rescindAtom = atomRuntime.fn(Facade.FacadeClient.f("Rescind"))

export const proposeAtom = atomRuntime.fn(Facade.FacadeClient.f("Propose"))

export const openAtom = atomRuntime.fn<void>()(
  Effect.fnUntraced(function* (_, get) {
    const state = yield* get.result(stateAtom)
    const common = { referrer: location.href }
    yield* Match.valueTags(state, {
      Challenged: ({ challengeId }) =>
        InternalEnv.isCrosshatch(origin)
          ? IdWidget.host(common)
          : LinkWidget.host({
              challengeId,
              allowance: {
                amount: Micros.make(10_000_000n),
                window: "Week",
              },
              ...common,
            }),
      Linked: () => EventsWidget.host(common),
    })
  }),
)
