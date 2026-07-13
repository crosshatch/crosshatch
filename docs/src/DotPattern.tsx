"use client"

import * as React from "react"

export interface DotPatternProps {
  readonly className?: string
  readonly children?: React.ReactNode
  /** Dot diameter in pixels */
  readonly dotSize?: number
  /** Gap between dots in pixels */
  readonly gap?: number
  /** Base dot color (hex) */
  readonly baseColor?: string
  /** Glow color on hover (hex) */
  readonly glowColor?: string
  /** Mouse proximity radius for highlighting */
  readonly proximity?: number
  /** Glow intensity multiplier */
  readonly glowIntensity?: number
  /** Wave animation speed (0 to disable) */
  readonly waveSpeed?: number
}

interface Dot {
  readonly x: number
  readonly y: number
  readonly baseOpacity: number
}

const cn = (...classes: ReadonlyArray<string | false | null | undefined>) => classes.filter(Boolean).join(" ")

const hexToRgb = (hex: string): { readonly r: number; readonly g: number; readonly b: number } => {
  const result = /^#?(?<r>[a-f\d]{2})(?<g>[a-f\d]{2})(?<b>[a-f\d]{2})$/iu.exec(hex)
  const groups = result?.groups
  return result
    ? {
        r: Number.parseInt(groups?.r ?? "00", 16),
        g: Number.parseInt(groups?.g ?? "00", 16),
        b: Number.parseInt(groups?.b ?? "00", 16),
      }
    : { r: 0, g: 0, b: 0 }
}

export const DotPattern = ({
  className,
  children,
  dotSize = 2,
  gap = 24,
  baseColor = "#404040",
  glowColor = "#22d3ee",
  proximity = 120,
  glowIntensity = 1,
  waveSpeed = 0.5,
}: DotPatternProps) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const dotsRef = React.useRef<Dot[]>([])
  const mouseRef = React.useRef({ x: -1000, y: -1000 })
  const animationRef = React.useRef<number>(undefined)
  const startTimeRef = React.useRef(Date.now())

  const baseRgb = React.useMemo(() => hexToRgb(baseColor), [baseColor])
  const glowRgb = React.useMemo(() => hexToRgb(glowColor), [glowColor])

  const buildGrid = React.useCallback(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const rect = container.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1

    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    canvas.style.width = `${rect.width}px`
    canvas.style.height = `${rect.height}px`

    const ctx = canvas.getContext("2d")
    if (ctx) ctx.scale(dpr, dpr)

    const cellSize = dotSize + gap
    const cols = Math.ceil(rect.width / cellSize) + 1
    const rows = Math.ceil(rect.height / cellSize) + 1
    const offsetX = (rect.width - (cols - 1) * cellSize) / 2
    const offsetY = (rect.height - (rows - 1) * cellSize) / 2

    const dots: Dot[] = []
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        dots.push({
          x: offsetX + col * cellSize,
          y: offsetY + row * cellSize,
          baseOpacity: 0.3 + Math.random() * 0.2,
        })
      }
    }
    dotsRef.current = dots
  }, [dotSize, gap])

  const draw = React.useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr)

    const { x: mx, y: my } = mouseRef.current
    const proxSq = proximity * proximity
    const time = (Date.now() - startTimeRef.current) * 0.001 * waveSpeed

    for (const dot of dotsRef.current) {
      const dx = dot.x - mx
      const dy = dot.y - my
      const distSq = dx * dx + dy * dy
      const wave = Math.sin(dot.x * 0.02 + dot.y * 0.02 + time) * 0.5 + 0.5
      const waveOpacity = dot.baseOpacity + wave * 0.15
      const waveScale = 1 + wave * 0.2

      let opacity = waveOpacity
      let scale = waveScale
      let r = baseRgb.r
      let g = baseRgb.g
      let b = baseRgb.b
      let glow = 0

      if (distSq < proxSq) {
        const dist = Math.sqrt(distSq)
        const t = 1 - dist / proximity
        const easedT = t * t * (3 - 2 * t)

        r = Math.round(baseRgb.r + (glowRgb.r - baseRgb.r) * easedT)
        g = Math.round(baseRgb.g + (glowRgb.g - baseRgb.g) * easedT)
        b = Math.round(baseRgb.b + (glowRgb.b - baseRgb.b) * easedT)
        opacity = Math.min(1, waveOpacity + easedT * 0.7)
        scale = waveScale + easedT * 0.8
        glow = easedT * glowIntensity
      }

      const radius = (dotSize / 2) * scale

      if (glow > 0) {
        const gradient = ctx.createRadialGradient(dot.x, dot.y, 0, dot.x, dot.y, radius * 4)
        gradient.addColorStop(0, `rgba(${glowRgb.r}, ${glowRgb.g}, ${glowRgb.b}, ${glow * 0.4})`)
        gradient.addColorStop(0.5, `rgba(${glowRgb.r}, ${glowRgb.g}, ${glowRgb.b}, ${glow * 0.1})`)
        gradient.addColorStop(1, `rgba(${glowRgb.r}, ${glowRgb.g}, ${glowRgb.b}, 0)`)
        ctx.beginPath()
        ctx.arc(dot.x, dot.y, radius * 4, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()
      }

      ctx.beginPath()
      ctx.arc(dot.x, dot.y, radius, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`
      ctx.fill()
    }

    animationRef.current = requestAnimationFrame(draw)
  }, [proximity, baseRgb, glowRgb, dotSize, glowIntensity, waveSpeed])

  React.useEffect(() => {
    buildGrid()

    const container = containerRef.current
    if (!container) return

    const ro = new ResizeObserver(buildGrid)
    ro.observe(container)

    return () => ro.disconnect()
  }, [buildGrid])

  React.useEffect(() => {
    animationRef.current = requestAnimationFrame(draw)
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [draw])

  React.useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      const canvas = canvasRef.current
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      }
    }

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 }
    }

    window.addEventListener("pointermove", handlePointerMove, { capture: true })
    document.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      window.removeEventListener("pointermove", handlePointerMove, { capture: true })
      document.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={cn("crosshatch-dot-pattern-root", className)}
      style={{ backgroundColor: "var(--crosshatch-dot-bg)", inset: 0, overflow: "hidden", position: "absolute" }}
    >
      <canvas
        ref={canvasRef}
        style={{ display: "block", height: "100%", inset: 0, position: "absolute", width: "100%" }}
      />
      <div
        style={{
          background: "var(--crosshatch-dot-vignette)",
          inset: 0,
          pointerEvents: "none",
          position: "absolute",
        }}
      />
      <div
        style={{
          border: "2px solid var(--crosshatch-dot-border)",
          borderRadius: "28px",
          boxShadow: "var(--crosshatch-dot-shadow)",
          filter: "blur(0.3px)",
          inset: 0,
          pointerEvents: "none",
          position: "absolute",
        }}
      />
      {children && <div style={{ height: "100%", position: "relative", width: "100%", zIndex: 10 }}>{children}</div>}
    </div>
  )
}
