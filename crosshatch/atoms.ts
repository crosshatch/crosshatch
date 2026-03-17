import { Finished } from "@crosshatch/util/widget/self"
import { Atom } from "@effect-atom/atom"
import { Effect, Stream, Option, Schema as S } from "effect"

import * as CrosshatchEnv from "./CrosshatchEnv.ts"
import * as Facade from "./Facade.ts"
import { atomRuntime } from "./runtime.ts"
import { EventsWidget, IdWidget, LinkWidget } from "./widgets.ts"
import { Required } from "./X402/Required.ts"

export const challengeIdAtom = atomRuntime.atom(
  Effect.gen(function* () {
    const facade = yield* Facade.Facade
    return Stream.fromPubSub(facade.signal).pipe(Stream.map(() => facade.challengeId))
  }).pipe(Stream.unwrap),
)

export const isLinkedAtom = challengeIdAtom.pipe(Atom.mapResult(Option.isNone))

export const unlinkAtom = atomRuntime.fn<void>()(
  Effect.fn(function* () {
    const facade = yield* Facade.Facade
    yield* facade.unlink
  }),
)

export const proposeAtom = atomRuntime.fn<{
  readonly required: typeof Required.Type
}>()(
  Effect.fn(function* ({ required }) {
    const facade = yield* Facade.Facade
    const decision = yield* facade.request(required)
    return { decision }
  }),
)

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
