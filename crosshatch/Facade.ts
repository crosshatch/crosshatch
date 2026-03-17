import * as Mutex from "@crosshatch/util/Mutex"
import { Introduce, RequestIntroduction } from "@crosshatch/util/widget/messages"
import { Worker, WorkerError } from "@effect/platform"
import { BrowserWorker, BrowserStream } from "@effect/platform-browser"
import { Exit, Deferred, Effect, Schema as S, Layer, Stream, Option, Context, PubSub } from "effect"

import { Actions, Listen, Propose, Unlink } from "./actions.ts"
import * as CrosshatchEnv from "./CrosshatchEnv.ts"
import { Decision } from "./Decision.ts"
import { EnclaveMessage } from "./events.ts"
import { LinkChallengeId } from "./LinkChallenge.ts"
import { Required } from "./X402/Required.ts"

export class Facade extends Context.Tag("crosshatch/Facade")<
  Facade,
  {
    challengeId: Option.Option<typeof LinkChallengeId.Type>
    pending: Record<number, Deferred.Deferred<typeof Decision.Type>>
    signal: PubSub.PubSub<void>
    request: (required: typeof Required.Type) => Effect.Effect<typeof Decision.Type, WorkerError.WorkerError>
    unlink: Effect.Effect<void, WorkerError.WorkerError>
  }
>() {}

export const layer = Effect.gen(function* () {
  const facadeReady = yield* Deferred.make<void>()
  yield* BrowserStream.fromEventListenerWindow("message").pipe(
    Stream.takeUntilEffect(
      Effect.fnUntraced(function* ({ data, origin }) {
        const isCrosshatch = yield* CrosshatchEnv.isCrosshatch(origin)
        return isCrosshatch && S.is(RequestIntroduction)(data)
      }),
    ),
    Stream.runHead,
    Effect.andThen(Deferred.done(facadeReady, Exit.void)),
  )
  const iframe = document.createElement("iframe")
  Object.assign(iframe, {
    id: "crosshatch-enclave",
    height: 1,
    sandbox: "allow-scripts allow-same-origin",
    src: yield* CrosshatchEnv.href("enclave"),
    width: 1,
  })
  Object.assign(iframe.style, { cssText })
  document.body.appendChild(iframe)
  yield* Deferred.await(facadeReady)
  const context = yield* Effect.fromNullable(iframe.contentWindow)
  const { port1, port2 } = new MessageChannel()
  context.postMessage(Introduce.make(), "*", [port2])
  const worker = yield* Worker.WorkerManager.pipe(
    Effect.flatMap((manager) => manager.spawn<typeof Actions.Type, typeof EnclaveMessage.Type, never>({})),
    Effect.provide(BrowserWorker.layer(() => port1)),
  )
  const signal = yield* PubSub.bounded<void>(1)
  const pending: Facade["Type"]["pending"] = {}
  let i = 0
  const facade: Facade["Type"] = {
    challengeId: Option.none(),
    pending,
    signal,
    request: Effect.fnUntraced(function* (required) {
      const proposalId = i++
      const deferred = yield* Deferred.make<typeof Decision.Type>()
      pending[proposalId] = deferred
      yield* worker.executeEffect(new Propose({ proposalId, required }))
      return yield* Deferred.await(deferred)
    }),
    unlink: worker.executeEffect(new Unlink()),
  }
  const hydrated = yield* Deferred.make<void>()
  yield* worker.execute(new Listen()).pipe(
    Stream.runForEach(
      Effect.fnUntraced(function* (event) {
        switch (event._tag) {
          case "EnclaveInitial": {
            facade.challengeId = Option.some(event.challengeId)
            yield* Deferred.done(hydrated, Exit.void)
            yield* signal.offer()
            break
          }
          case "EnclaveLinked": {
            facade.challengeId = Option.none()
            yield* Deferred.done(hydrated, Exit.void)
            yield* signal.offer()
            break
          }
          case "EnclaveDecision": {
            const { proposalId, decision } = event
            const { [proposalId]: pending_, ...rest } = facade.pending
            const pending = yield* Effect.fromNullable(pending_)
            yield* Deferred.done(pending, Exit.succeed(decision))
            facade.pending = rest
            break
          }
        }
      }, Mutex.task),
    ),
    Effect.provide(Mutex.layer),
    Effect.forkScoped,
  )
  yield* Deferred.await(hydrated)
  return facade
}).pipe(Layer.scoped(Facade))

const cssText = Object.entries({
  border: 0,
  bottom: "-1px",
  clipPath: "inset(50%)",
  left: "-1px",
  opacity: 0,
  overflow: "hidden",
  padding: 0,
  pointerEvents: "none",
  position: "absolute",
})
  .map(([k, v]) => `${k}: ${v};`)
  .join(" ")
