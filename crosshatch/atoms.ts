import { Atom } from "@effect-atom/atom"
import { Effect, Stream, Option } from "effect"

import { BridgeClient } from "./BridgeClient.ts"
import { CrosshatchEnv } from "./CrosshatchEnv.ts"
import { atomRuntime } from "./runtime.ts"
import { EventsWidget, IdWidget, LinkWidget } from "./widgets.ts"

export const challengeIdAtom = BridgeClient.query("GetChallenge", void 0)

export const isLinkedAtom = challengeIdAtom.pipe(Atom.mapResult(Option.isNone))

export const unlinkAtom = BridgeClient.mutation("Unlink")

export const proposeAtom = BridgeClient.mutation("Propose")

export const openSessionWidgetAtom = atomRuntime.fn<void>()(
  Effect.fn(function* (_, get) {
    const { isCrosshatch } = yield* CrosshatchEnv
    const challengeId = yield* get.result(challengeIdAtom)
    const common = { referrer: location.href }
    const widgetStream = Option.match(challengeId, {
      onSome: (id) => {
        if (isCrosshatch(location.origin)) {
          return IdWidget.stream(common)
        }
        return LinkWidget.stream({
          amount: 10,
          id,
          window: "Week",
          ...common,
        })
      },
      onNone: () => EventsWidget.stream(common),
    })
    yield* widgetStream.pipe(Stream.runDrain)
  }),
)
