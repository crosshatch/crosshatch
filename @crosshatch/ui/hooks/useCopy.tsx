import { CheckIcon, ClipboardIcon } from "lucide-react"
import { useEffect, useState } from "react"

export const useCopy = (text: string) => {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setTimeout(() => setCopied(false), 2000)
  }, [copied])

  const copy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
  }

  return {
    copied,
    copy,
    icon: copied ? <CheckIcon /> : <ClipboardIcon />,
  }
}
