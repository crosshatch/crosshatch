import { Suspense } from "react"
import { cn } from "../cn.ts"
import { Skeleton } from "./Skeleton.tsx"

export const Sus = ({ className, skeletonClassName, children, dev }: {
  className?: string | undefined
  skeletonClassName?: string | undefined
  children: React.ReactNode
  dev?: boolean | undefined
}) => {
  const props = {
    className: cn("flex justify-center items-center rounded-none", skeletonClassName),
  }
  return dev
    ? <Skeleton {...props} />
    : (
      <Suspense fallback={<Skeleton {...props} />}>
        {className ? <div {...{ className }}>{children}</div> : children}
      </Suspense>
    )
}
