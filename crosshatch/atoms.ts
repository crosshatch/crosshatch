import { Atom } from "@effect-atom/atom"
import { Effect } from "effect"
import { homeHref, linkHref } from "./config.ts"
import { dialog } from "./dialog.ts"
import { linkState } from "./methods.ts"

export const linkStateAtom = Atom.make(linkState)

export const isLinkedAtom = linkStateAtom.pipe(
  Atom.mapResult(({ _tag }) => _tag === "Linked"),
)

export const openSessionWidgetAtom = Atom.fn<void>()(
  Effect.fn(function*(_, get) {
    const linkState = yield* get.result(linkStateAtom)
    switch (linkState._tag) {
      case "Anonymous": {
        const { challengeId } = linkState
        return yield* linkHref({
          id: challengeId,
          window: "Week",
          amount: 10,
          presentation: "Embedded",
          referrer: location.href,
        })
      }
      case "Linked": {
        return yield* homeHref({
          presentation: "Embedded",
          referrer: location.href,
        })
      }
    }
  }, Effect.flatMap(dialog)),
)
