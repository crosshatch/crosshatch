import { cn } from "../cn.ts"

export const Section = ({ className, ...rest }: React.ComponentProps<"div">) => (
  <div className={cn("flex w-full", className)} {...rest} />
)

export const SectionInner = ({ className, ...rest }: React.ComponentProps<"div">) => (
  <div className={cn("relative mx-auto flex h-full w-full max-w-5xl flex-col", className)} {...rest} />
)
