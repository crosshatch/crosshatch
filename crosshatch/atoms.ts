import { Finished } from "@crosshatch/util/widget/self"
import { Atom } from "@effect-atom/atom"
import { Effect, Stream, Option, Schema as S } from "effect"

import * as CrosshatchEnv from "./CrosshatchEnv.ts"
import { FacadeAccumulator } from "./FacadeAccumulator.ts"
import { FacadeClient } from "./FacadeClient.ts"
import { atomRuntime } from "./runtime.ts"
import { EventsWidget, IdWidget, LinkWidget } from "./widgets.ts"

export const challengeIdAtom = atomRuntime.atom(FacadeAccumulator.stream("challengeId"))

export const isLinkedAtom = challengeIdAtom.pipe(Atom.mapResult(Option.isNone))

export const rescindAtom = atomRuntime.fn(FacadeClient.fn("Rescind"))

export const proposeAtom = atomRuntime.fn(FacadeClient.fn("Propose"))

export const openSessionWidgetAtom = atomRuntime.fn<void>()(
  Effect.fn(function* (_, get) {
    const isCrosshatch = yield* CrosshatchEnv.isCrosshatch(origin)
    const challengeId = yield* get.result(challengeIdAtom)
    const common = { referrer: location.href }
    const stream = Option.match(challengeId, {
      onSome: (challengeId) =>
        isCrosshatch
          ? IdWidget.stream(common)
          : LinkWidget.stream({
              amount: 10,
              challengeId,
              window: "Week",
              ...common,
            }),
      onNone: () => EventsWidget.stream(common),
    })
    yield* stream.pipe(Stream.takeUntil(S.is(Finished)), Stream.runDrain)
  }),
)
