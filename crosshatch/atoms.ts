import { Finished } from "@crosshatch/widget/self"
import { Atom } from "@effect-atom/atom"
import { Effect, Stream, Match, Schema as S, Cause } from "effect"

import { stream } from "./Accumulator.ts"
import * as CrosshatchEnv from "./CrosshatchEnv.ts"
import { FacadeClient } from "./FacadeClient.ts"
import { atomRuntime } from "./runtime.ts"
import { EventsWidget, IdWidget, LinkWidget } from "./widgets.ts"

export const stateAtom = atomRuntime.atom(stream)

export const isLinkedAtom = stateAtom.pipe(Atom.mapResult((v) => v._tag === "Linked"))

export const challengedAtom = atomRuntime.atom((ctx) =>
  ctx.result(stateAtom).pipe(
    Effect.filterOrFail(
      (v) => v._tag === "Challenged",
      () => new Cause.NoSuchElementException(),
    ),
  ),
)

export const rescindAtom = atomRuntime.fn(FacadeClient.f("Rescind"))

export const proposeAtom = atomRuntime.fn(FacadeClient.f("Propose"))

export const openSessionWidgetAtom = atomRuntime.fn<void>()(
  Effect.fnUntraced(function* (_, get) {
    const isCrosshatch = yield* CrosshatchEnv.isCrosshatch(origin)
    const state = yield* get.result(stateAtom).pipe(Effect.filterOrFail((v) => v._tag !== "Initial"))
    const common = { referrer: location.href }
    const stream = Match.value(state).pipe(
      Match.tagsExhaustive({
        Challenged: ({ challengeId }) =>
          isCrosshatch
            ? IdWidget.stream(common)
            : LinkWidget.stream({
                amount: 10,
                challengeId,
                window: "Week",
                ...common,
              }),
        Linked: () => EventsWidget.stream(common),
      }),
    )
    yield* stream.pipe(Stream.takeUntil(S.is(Finished)), Stream.runDrain)
  }),
)
