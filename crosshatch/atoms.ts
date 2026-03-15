import { Finished } from "@crosshatch/util/widget/self"
import { Atom } from "@effect-atom/atom"
import { Effect, Stream, Option, Schema as S } from "effect"

import * as CrosshatchEnv from "./CrosshatchEnv.ts"
import { FacadeClient } from "./FacadeClient.ts"
import { atomRuntime } from "./runtime.ts"
import { EventsWidget, IdWidget, LinkWidget } from "./widgets.ts"

export const challengeIdAtom = FacadeClient.query("GetChallenge", void 0)

export const isLinkedAtom = challengeIdAtom.pipe(Atom.mapResult(Option.isNone))

export const unlinkAtom = FacadeClient.mutation("Unlink")

export const proposeAtom = FacadeClient.mutation("Propose")

export const openSessionWidgetAtom = atomRuntime.fn<void>()(
  Effect.fn(function* (_, get) {
    const isCrosshatch = yield* CrosshatchEnv.isCrosshatch(origin)
    const challengeId = yield* get.result(challengeIdAtom)
    const common = { referrer: location.href }
    const stream = Option.match(challengeId, {
      onSome: (id) =>
        isCrosshatch
          ? IdWidget.stream(common)
          : LinkWidget.stream({
              amount: 10,
              id,
              window: "Week",
              ...common,
            }),
      onNone: () => EventsWidget.stream(common),
    })
    yield* stream.pipe(Stream.takeUntil(S.is(Finished)), Stream.runDrain)
  }),
)
