import { Atom } from "@effect-atom/atom"
import { Effect, Stream } from "effect"
import { BridgeClient } from "./BridgeClient.ts"
import { env } from "./env.ts"
import { EventsWidget, IdWidget, LinkWidget } from "./widgets.ts"
import type { PaymentRequired } from "./X402/schemas.ts"

export const linkStateAtom = BridgeClient.atomRuntime.atom(Effect.gen(function*() {
  const bridge = yield* BridgeClient
  return yield* bridge.status()
}))

export const isLinkedAtom = linkStateAtom.pipe(
  Atom.mapResult(({ _tag }) => _tag === "Linked"),
)

export const unlinkAtom = BridgeClient.atomRuntime.fn<void>()(Effect.fn(function*() {
  const bridge = yield* BridgeClient
  return yield* bridge.unlink()
}))

export const payAtom = Effect.fn(function*(required: typeof PaymentRequired.Type) {
  const bridge = yield* BridgeClient
  return yield* bridge.propose({ required })
})

export const openSessionWidgetAtom = BridgeClient.atomRuntime.fn<void>()(Effect.fn(function*(_, get) {
  const linkState = yield* get.result(linkStateAtom)
  switch (linkState._tag) {
    case "Anonymous": {
      if (env.isCrosshatch(origin)) {
        return yield* IdWidget.stream({
          referrer: location.href,
        }).pipe(
          Stream.runDrain,
        )
      } else {
        const { challengeId } = linkState
        return yield* LinkWidget.stream({
          id: challengeId,
          window: "Week",
          amount: 10,
          referrer: location.href,
        }).pipe(
          Stream.runDrain,
        )
      }
    }
    case "Linked": {
      return yield* EventsWidget.stream({
        referrer: location.href,
      }).pipe(
        Stream.runDrain,
      )
    }
  }
}))
