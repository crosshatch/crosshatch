"use client"

import { asciiBackground } from "asciify-engine"
import * as React from "react"

export const AsciiRainBackground = () => {
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const element = ref.current
    if (!element) return

    const background = asciiBackground(element, {
      type: "wave",
      opacity: 0.15,
      colorScheme: "dark",
    })

    return () => background.destroy()
  }, [])

  return <div aria-hidden="true" className="crosshatch-ascii-rain" ref={ref} />
}
