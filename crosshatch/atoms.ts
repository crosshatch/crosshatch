import { Atom } from "@effect-atom/atom"
import { Effect, Stream } from "effect"
import { appUrl } from "./env.ts"
import { linkState } from "./methods.ts"
import { EventsWidget, IdWidget, LinkWidget } from "./widgets.ts"

export const linkStateAtom = Atom.make(linkState)

export const isLinkedAtom = linkStateAtom.pipe(
  Atom.mapResult(({ _tag }) => _tag === "Linked"),
)

export const openSessionWidgetAtom = Atom.fn<void>()(Effect.fn(function*(_, get) {
  const linkState = yield* get.result(linkStateAtom)
  switch (linkState._tag) {
    case "Anonymous": {
      if (origin === appUrl) {
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
