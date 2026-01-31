import { CSuspense } from "@crosshatch/ui/components/CSuspense"
import { ImageZoom } from "fumadocs-ui/components/image-zoom"
import { useTheme } from "next-themes"
import { use, useEffect, useId, useState } from "react"

export const Mermaid = ({ chart }: { chart: string }) => {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return
  return (
    <CSuspense>
      <MermaidContent {...{ chart }} />
    </CSuspense>
  )
}

const cache = new Map<string, Promise<unknown>>()

function cachePromise<T>(
  key: string,
  setPromise: () => Promise<T>,
): Promise<T> {
  const cached = cache.get(key)
  if (cached) return cached as Promise<T>

  const promise = setPromise()
  cache.set(key, promise)
  return promise
}

const MermaidContent = ({ chart }: { chart: string }) => {
  const id = useId()
  const { resolvedTheme } = useTheme()
  const { default: mermaid } = use(cachePromise("mermaid", () => import("mermaid")))
  mermaid.initialize({
    startOnLoad: false,
    fontFamily: "inherit",
    theme: resolvedTheme === "dark" ? "dark" : "default",
    htmlLabels: false,
  })
  const { svg } = use(
    cachePromise(`${chart}-${resolvedTheme}`, () => mermaid.render(id, chart.replaceAll("\\n", "\n"))),
  )
  const encoded = encodeURIComponent(svg).replace(/'/g, "%27").replace(/"/g, "%22")
  return (
    <div>
      <ImageZoom>
        <img src={`data:image/svg+xml,${encoded}`} />
      </ImageZoom>
    </div>
  )
}
