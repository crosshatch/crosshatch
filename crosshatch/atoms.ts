import { Atom } from "@effect-atom/atom"
import type { PaymentRequired } from "@x402/core/types"
import { Effect } from "effect"
import { BridgeClient } from "./BridgeClient.ts"
import { BridgeClientLive, runtime } from "./BridgeClientLive.ts"
import { homeHref, linkHref } from "./config.ts"
import { dialog } from "./dialog.ts"

export const unlink = () =>
  Effect.gen(function*() {
    const bridge = yield* BridgeClient
    return yield* bridge.unlink(void 0)
  }).pipe(
    runtime.runPromise,
  )

export const pay = (requirement: PaymentRequired) =>
  Effect.gen(function*() {
    const bridge = yield* BridgeClient
    return yield* bridge.payment({ requirement })
  }).pipe(
    runtime.runPromise,
  )

const atomRuntime = Atom.runtime(BridgeClientLive)

export const linkStateAtom = atomRuntime.atom(Effect.gen(function*() {
  const bridge = yield* BridgeClient
  return yield* bridge.linkState(void 0)
}))

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
