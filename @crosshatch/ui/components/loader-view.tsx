import { cn } from "../cn"
import { CircularLoader } from "./loader"

export const LoaderView = ({ className }: { className?: string | undefined }) => (
  <div className={cn("flex flex-1 justify-center items-center", className)}>
    <CircularLoader />
  </div>
)
