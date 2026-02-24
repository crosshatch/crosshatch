import { Atom } from "@effect-atom/atom"
import { Effect, Stream, Option, Scope, Exit } from "effect"

import { CrosshatchEnv } from "./CrosshatchEnv.ts"
import { FacadeClient } from "./FacadeClient.ts"
import { atomRuntime } from "./runtime.ts"
import { EventsWidget, IdWidget, LinkWidget } from "./widgets.ts"

export const challengeIdAtom = FacadeClient.query("GetChallenge", void 0)

export const isLinkedAtom = challengeIdAtom.pipe(Atom.mapResult(Option.isNone))

export const unlinkAtom = FacadeClient.mutation("Unlink")

export const proposeAtom = FacadeClient.mutation("Propose")

export const openSessionWidgetAtom = atomRuntime.fn<void>()(
  Effect.fn(function* (_, get) {
    const { isCrosshatch } = yield* CrosshatchEnv
    const challengeId = yield* get.result(challengeIdAtom)
    const common = { referrer: location.href }
    const widgetStream = Option.match(challengeId, {
      onSome: (id) =>
        isCrosshatch(location.origin)
          ? IdWidget.stream(common)
          : LinkWidget.stream({
              amount: 10,
              id,
              window: "Week",
              ...common,
            }),
      onNone: () => EventsWidget.stream(common),
    })
    const scope = yield* Scope.make()
    yield* widgetStream.pipe(
      Stream.runForEach(
        Effect.fn(function* (item) {
          if (item._tag === "Finished") {
            yield* Scope.close(scope, Exit.succeed(undefined))
          }
        }),
      ),
      Effect.forkScoped,
      Scope.extend(scope),
    )
  }),
)
