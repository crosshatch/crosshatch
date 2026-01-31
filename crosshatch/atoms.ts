import { Widget } from "@crosshatch/util"
import { Atom } from "@effect-atom/atom"
import { Effect, Schema as S, Stream } from "effect"
import { homeHref, linkHref } from "./config.ts"
import { linkState } from "./methods.ts"

export const linkStateAtom = Atom.make(linkState)

export const isLinkedAtom = linkStateAtom.pipe(
  Atom.mapResult(({ _tag }) => _tag === "Linked"),
)

export const openSessionWidgetAtom = Atom.fn<void>()(
  Effect.fn(
    function*(_, get) {
      const linkState = yield* get.result(linkStateAtom)
      switch (linkState._tag) {
        case "Anonymous": {
          const { challengeId } = linkState
          return yield* linkHref({
            id: challengeId,
            window: "Week",
            amount: 10,
            referrer: location.href,
          })
        }
        case "Linked": {
          return yield* homeHref({
            referrer: location.href,
          })
        }
      }
    },
    Effect.flatMap((src) =>
      Widget.make({
        src,
        schema: S.Void,
      }).pipe(Stream.runDrain)
    ),
  ),
)
