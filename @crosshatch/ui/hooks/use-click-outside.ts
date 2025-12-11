import * as React from "react"

export const useClickOutside = (refs: React.RefObject<HTMLElement | null>[], f: (event: MouseEvent) => void): void => {
  const callbackRef = React.useRef(f)
  callbackRef.current = f
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      const target = event.target
      if (!(target instanceof Node) || refs.every((elementRef) => !elementRef.current?.contains(target))) {
        callbackRef.current?.(event)
      }
    }
    document.addEventListener("click", handleClickOutside, true)
    return () => document.removeEventListener("click", handleClickOutside, true)
  }, [refs])
}
