import { Atom } from "@effect-atom/atom"
import { Effect, Stream } from "effect"

import { BridgeClient } from "./BridgeClient.ts"
import { CrosshatchEnv } from "./CrosshatchEnv.ts"
import { atomRuntime } from "./runtime.ts"
import { EventsWidget, IdWidget, LinkWidget } from "./widgets.ts"

export const linkStateAtom = BridgeClient.query("status", void 0)

export const isLinkedAtom = linkStateAtom.pipe(Atom.mapResult(({ _tag }) => _tag === "Linked"))

export const unlinkAtom = BridgeClient.mutation("unlink")

export const proposeAtom = BridgeClient.mutation("propose")

export const openSessionWidgetAtom = atomRuntime.fn<void>()(
  Effect.fn(function* (_, get) {
    const { isCrosshatch } = yield* CrosshatchEnv
    const linkState = yield* get.result(linkStateAtom)
    switch (linkState._tag) {
      case "Anonymous": {
        if (isCrosshatch(origin)) {
          return yield* IdWidget.stream({
            referrer: location.href,
          }).pipe(Stream.runDrain)
        } else {
          const { challengeId } = linkState
          return yield* LinkWidget.stream({
            amount: 10,
            id: challengeId,
            referrer: location.href,
            window: "Week",
          }).pipe(Stream.runDrain)
        }
      }
      case "Linked": {
        return yield* EventsWidget.stream({
          referrer: location.href,
        }).pipe(Stream.runDrain)
      }
    }
  }),
)
