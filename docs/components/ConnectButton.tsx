"use client"

import { useAtomSet } from "@effect/atom-react"
import { openAtom } from "crosshatch/Browser"

export const ConnectButton = () => {
  const open = useAtomSet(openAtom)

  return (
    <button
      type="button"
      className="vocs:rounded-lg vocs:border vocs:border-blue-500/40 vocs:bg-blue-500/10 vocs:px-4 vocs:py-2 vocs:text-sm vocs:font-medium vocs:text-blue-300 vocs:transition-colors hover:vocs:bg-blue-500/20 hover:vocs:text-blue-200"
      onClick={() => open()}
    >
      Connect
    </button>
  )
}
