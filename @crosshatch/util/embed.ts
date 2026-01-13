import { type FeatureExtractionPipeline, pipeline } from "@huggingface/transformers"
import { Cause, Effect } from "effect"

let pipeline_: Promise<FeatureExtractionPipeline> | undefined
const getPipeline = () => {
  if (!pipeline_) {
    pipeline_ = pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2", {
      dtype: "q8",
      progress_callback: (v) => {
        console.log(JSON.stringify(v))
      },
    }) as never
  }
  return pipeline_
}

export const embed = Effect.fn(function*(text: string): Effect.fn.Return<Array<number>, Cause.UnknownException> {
  const embed = yield* Effect.tryPromise(getPipeline)
  return yield* Effect.tryPromise(() =>
    embed(text, {
      pooling: "mean",
      normalize: true,
    })
  ).pipe(
    Effect.map(({ data }) => [...data]),
  )
})
