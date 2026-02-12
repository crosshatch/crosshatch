import { Atom, useAtom } from "@effect-atom/atom-react"
import { CheckIcon, ClipboardIcon } from "lucide-react"
import { useEffect, useRef } from "react"

const copiedIdAtom = Atom.make<string | undefined>(undefined)

export const useCopy = (text: string, size?: number | undefined) => {
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
  const iconProps = {
    className: `size-${size} stroke-1 opacity-50`,
  }
  return {
    copied,
    copy,
    icon: copied ? <CheckIcon {...iconProps} /> : <ClipboardIcon {...iconProps} />,
  }
}
