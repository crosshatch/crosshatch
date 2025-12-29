import { addEqualityTesters } from "@effect/vitest"

addEqualityTesters()

const ignore = ["ExperimentalWarning"]
const emitWarning = process.emitWarning
process.emitWarning = (warning: any, ...args: any) => {
  const [head] = args
  if (head != null) {
    if (typeof head === "string" && ignore.includes(head)) return
    if (typeof head === "object" && ignore.includes(head.type)) return
  }
  return emitWarning(warning, ...args)
}
