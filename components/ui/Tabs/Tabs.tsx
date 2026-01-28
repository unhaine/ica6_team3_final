"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "@/lib/utils"
import { tabsListVariants, tabsStyles } from "./Tabs.style"
import { TabsProps, TabsListProps, TabsTriggerProps, TabsContentProps } from "./Tabs.type"

/**
 * 탭 컴포넌트
 * @description 콘텐츠를 탭 인터페이스로 나누어 보여주는 컴포넌트
 */
export const Tabs = ({
    className,
    orientation = "horizontal",
    ...props
}: TabsProps) => {
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

/**
 * 탭 리스트
 */
export const TabsList = ({
    className,
    variant = "default",
    ...props
}: TabsListProps) => {
    return (
        <TabsPrimitive.List
            data-slot="tabs-list"
            data-variant={variant}
            className={cn(tabsListVariants({ variant }), className)}
            {...props}
        />
    )
}

/**
 * 탭 트리거
 */
export const TabsTrigger = ({
    className,
    ...props
}: TabsTriggerProps) => {
    return (
        <TabsPrimitive.Trigger
            data-slot="tabs-trigger"
            className={cn(tabsStyles.trigger, className)}
            {...props}
        />
    )
}

/**
 * 탭 콘텐츠
 */
export const TabsContent = ({
    className,
    ...props
}: TabsContentProps) => {
    return (
        <TabsPrimitive.Content
            data-slot="tabs-content"
            className={cn(tabsStyles.content, className)}
            {...props}
        />
    )
}

export { tabsListVariants }
