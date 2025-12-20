import { pipeline } from "@huggingface/transformers"
import { Cause, Effect } from "effect"

export const embed = Effect.fn(function*(text: string): Effect.fn.Return<Array<number>, Cause.UnknownException> {
  const embed = yield* Effect.tryPromise(() =>
    pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2", { dtype: "fp32" })
  )
  return yield* Effect.tryPromise(() =>
    embed(text, {
      pooling: "mean",
      normalize: true,
    })
  ).pipe(
    Effect.map(({ data }) => [...data]),
  )
})
