"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "@/lib/utils"
import { tabsListVariants, tabsStyles } from "./Tabs.style"
import { TabsProps, TabsListProps, TabsTriggerProps, TabsContentProps } from "./Tabs.type"

function Tabs({
    className,
    orientation = "horizontal",
    ...props
}: TabsProps) {
    return (
        <TabsPrimitive.Root
            data-slot="tabs"
            data-orientation={orientation}
            orientation={orientation}
            className={cn(tabsStyles.root, className)}
            {...props}
        />
    )
}

function TabsList({
    className,
    variant = "default",
    ...props
}: TabsListProps) {
    return (
        <TabsPrimitive.List
            data-slot="tabs-list"
            data-variant={variant}
            className={cn(tabsListVariants({ variant }), className)}
            {...props}
        />
    )
}

function TabsTrigger({
    className,
    ...props
}: TabsTriggerProps) {
    return (
        <TabsPrimitive.Trigger
            data-slot="tabs-trigger"
            className={cn(tabsStyles.trigger, className)}
            {...props}
        />
    )
}

function TabsContent({
    className,
    ...props
}: TabsContentProps) {
    return (
        <TabsPrimitive.Content
            data-slot="tabs-content"
            className={cn(tabsStyles.content, className)}
            {...props}
        />
    )
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants }
