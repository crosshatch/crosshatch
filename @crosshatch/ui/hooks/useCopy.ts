import { useAtom } from "@effect/atom-react"
import { Atom } from "effect/unstable/reactivity"
import { useEffect, useRef } from "react"

const copiedIdAtom = Atom.make<string | undefined>(undefined)

export const useCopy = (text: string) => {
  const idRef = useRef(crypto.randomUUID())
  const [copiedId, setCopiedId] = useAtom(copiedIdAtom)
  const copied = idRef.current === copiedId
  useEffect(() => {
    if (!copied) return
    const timeoutId = setTimeout(() => {
      if (idRef.current === copiedId) {
        setCopiedId(undefined)
      }
    }, 2000)
    return () => clearTimeout(timeoutId)
  }, [copied])
  const copy = async () => {
    await navigator.clipboard.writeText(text)
    setCopiedId(idRef.current)
  }
  return { copied, copy }
}
