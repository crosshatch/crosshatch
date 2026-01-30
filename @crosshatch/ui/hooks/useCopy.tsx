import { CheckIcon, ClipboardIcon } from "lucide-react"
import { useEffect, useState } from "react"

export const useCopy = (text: string, size?: number | undefined) => {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timeoutId = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(timeoutId)
  }, [copied])

  const copy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
  }

  const props = { className: `size-${size} stroke-1 opacity-50` }

  return {
    copied,
    copy,
    icon: copied ? <CheckIcon {...props} /> : <ClipboardIcon {...props} />,
  }
}
