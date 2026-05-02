import { Content, Header, Item, Root, Trigger } from "@radix-ui/react-accordion"
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react"
import * as React from "react"

import { cn } from "../cn.ts"

function Accordion({ className, ...props }: React.ComponentProps<typeof Root>) {
  return <Root data-slot="accordion" className={cn("flex w-full flex-col", className)} {...props} />
}

function AccordionItem({ className, ...props }: React.ComponentProps<typeof Item>) {
  return <Item data-slot="accordion-item" className={cn("not-last:border-b", className)} {...props} />
}

function AccordionTrigger({ className, children, ...props }: React.ComponentProps<typeof Trigger>) {
  return (
    <Header className="flex">
      <Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group/accordion-trigger focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:after:border-ring **:data-[slot=accordion-trigger-icon]:text-muted-foreground relative flex flex-1 items-start justify-between rounded-lg border border-transparent py-2.5 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 **:data-[slot=accordion-trigger-icon]:ml-auto **:data-[slot=accordion-trigger-icon]:size-4",
          className,
        )}
        {...props}
      >
        {children}
        <ChevronDownIcon
          data-slot="accordion-trigger-icon"
          className="pointer-events-none shrink-0 group-aria-expanded/accordion-trigger:hidden"
        />
        <ChevronUpIcon
          data-slot="accordion-trigger-icon"
          className="pointer-events-none hidden shrink-0 group-aria-expanded/accordion-trigger:inline"
        />
      </Trigger>
    </Header>
  )
}

function AccordionContent({ className, children, ...props }: React.ComponentProps<typeof Content>) {
  return (
    <Content
      data-slot="accordion-content"
      className="data-closed:animate-accordion-up data-open:animate-accordion-down overflow-hidden text-sm"
      {...props}
    >
      <div
        className={cn(
          "[&_a]:hover:text-foreground h-(--radix-accordion-content-height) pt-0 pb-2.5 [&_a]:underline [&_a]:underline-offset-3 [&_p:not(:last-child)]:mb-4",
          className,
        )}
      >
        {children}
      </div>
    </Content>
  )
}

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger }
