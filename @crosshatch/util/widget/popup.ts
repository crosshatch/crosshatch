// TODO: refactor
import { Effect, Schema as S, Stream } from "effect"

import type { WidgetConfig } from "./self.ts"

import * as ParentContext from "../ParentContext.ts"

export const popup = <A, I>({ src, item = S.Never as never }: WidgetConfig<A, I>) =>
  Stream.asyncScoped<A>((emit) => {
    const { origin: expectedOrigin } = new URL(src)
    const decodeOption = S.decodeUnknownOption(item)
    const controller = new AbortController()
    const { signal } = controller
    const timeout = setInterval(async () => {
      if (context?.closed) {
        controller.abort()
        emit.end()
        clearTimeout(timeout) // TODO
      }
    }, 1)
    addEventListener(
      "message",
      async ({ data, origin }) => {
        if (origin === expectedOrigin) {
          if (S.is(ParentContext.RequestIntroduction)(data)) {
            context?.postMessage(ParentContext.Introduction.make(), origin)
          }
          const option = decodeOption(data)
          if (option._tag === "Some") {
            const { value } = option
            emit.single(value)
          }
        }
      },
      { signal },
    )
    const context = open(src)
    return Effect.addFinalizer(() =>
      Effect.sync(() => {
        controller.abort()
        context?.close()
      }),
    )
  })
