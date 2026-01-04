import { Atom } from "@effect-atom/atom-react"

export const chatAtom = Atom.family((_chatId?: string | undefined) =>
  Atom.make({
    text: "",
    inflight: undefined,
  } as {
    text: string
    inflight: AbortController | undefined
  }).pipe(
    Atom.keepAlive,
  )
)
