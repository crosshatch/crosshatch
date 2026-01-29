import { cn } from "../cn.ts"
import { CircularLoader } from "./Loader.tsx"

export const LoaderView = ({ className }: { className?: string | undefined }) => (
  <div className={cn("flex flex-1 justify-center items-center", className)}>
    <CircularLoader />
  </div>
)
