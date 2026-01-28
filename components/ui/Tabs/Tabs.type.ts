import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { type VariantProps } from "class-variance-authority"
import { tabsListVariants } from "./Tabs.style"

/** Tabs 루트 컴포넌트 Props */
export type TabsProps = React.ComponentProps<typeof TabsPrimitive.Root>
/** Tabs 리스트 컴포넌트 Props */
export interface TabsListProps extends React.ComponentProps<typeof TabsPrimitive.List>, VariantProps<typeof tabsListVariants> {}
/** Tabs 트리거 컴포넌트 Props */
export type TabsTriggerProps = React.ComponentProps<typeof TabsPrimitive.Trigger>
/** Tabs 콘텐츠 컴포넌트 Props */
export type TabsContentProps = React.ComponentProps<typeof TabsPrimitive.Content>
