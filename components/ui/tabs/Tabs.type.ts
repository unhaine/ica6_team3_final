import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { type VariantProps } from "class-variance-authority"
import { tabsListVariants } from "./Tabs.style"

export type TabsProps = React.ComponentProps<typeof TabsPrimitive.Root>
export type TabsListProps = React.ComponentProps<typeof TabsPrimitive.List> &
    VariantProps<typeof tabsListVariants>
export type TabsTriggerProps = React.ComponentProps<typeof TabsPrimitive.Trigger>
export type TabsContentProps = React.ComponentProps<typeof TabsPrimitive.Content>
