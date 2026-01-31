import { Suspense } from "react"
import { cn } from "../cn.ts"
import { Skeleton } from "./Skeleton.tsx"

export const CSuspense = ({ className, skeletonClassName, children, dev }: {
  readonly className?: string | undefined
  readonly skeletonClassName?: string | undefined
  readonly children: React.ReactNode
  readonly dev?: boolean | undefined
}) => {
  const props = { className: cn("flex justify-center items-center", skeletonClassName) }
  return dev
    ? <Skeleton {...props} />
    : (
      <Suspense fallback={<Skeleton {...props} />}>
        {className
          ? (
            <div className={cn("flex flex-col flex-1", className)}>
              {children}
            </div>
          )
          : children}
      </Suspense>
    )
}
