"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { selectStyles } from "./Select.style"
import {
    SelectProps,
    SelectGroupProps,
    SelectValueProps,
    SelectTriggerProps,
    SelectContentProps,
    SelectLabelProps,
    SelectItemProps,
    SelectSeparatorProps,
    SelectScrollUpButtonProps,
    SelectScrollDownButtonProps,
} from "./Select.type"

function Select({
    ...props
}: SelectProps) {
    return <SelectPrimitive.Root data-slot="select" {...props} />
}

function SelectGroup({
    ...props
}: SelectGroupProps) {
    return <SelectPrimitive.Group data-slot="select-group" {...props} />
}

function SelectValue({
    ...props
}: SelectValueProps) {
    return <SelectPrimitive.Value data-slot="select-value" {...props} />
}

function SelectTrigger({
    className,
    size = "default",
    children,
    ...props
}: SelectTriggerProps) {
    return (
        <SelectPrimitive.Trigger
            data-slot="select-trigger"
            data-size={size}
            className={cn(selectStyles.trigger, className)}
            {...props}
        >
            {children}
            <SelectPrimitive.Icon asChild>
                <ChevronDownIcon className="size-4 opacity-50" />
            </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
    )
}

function SelectContent({
    className,
    children,
    position = "item-aligned",
    align = "center",
    ...props
}: SelectContentProps) {
    return (
        <SelectPrimitive.Portal>
            <SelectPrimitive.Content
                data-slot="select-content"
                className={cn(
                    selectStyles.content,
                    position === "popper" &&
                        "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
                    className
                )}
                position={position}
                align={align}
                {...props}
            >
                <SelectScrollUpButton />
                <SelectPrimitive.Viewport
                    className={cn(
                        selectStyles.viewport,
                        position === "popper" &&
                        "h-(--radix-select-trigger-height) w-full min-w-(--radix-select-trigger-width) scroll-my-1"
                    )}
                >
                    {children}
                </SelectPrimitive.Viewport>
                <SelectScrollDownButton />
            </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
    )
}

function SelectLabel({
    className,
    ...props
}: SelectLabelProps) {
    return (
        <SelectPrimitive.Label
            data-slot="select-label"
            className={cn(selectStyles.label, className)}
            {...props}
        />
    )
}

function SelectItem({
    className,
    children,
    ...props
}: SelectItemProps) {
    return (
        <SelectPrimitive.Item
            data-slot="select-item"
            className={cn(selectStyles.item, className)}
            {...props}
        >
            <span
                data-slot="select-item-indicator"
                className={selectStyles.itemIndicator}
            >
                <SelectPrimitive.ItemIndicator>
                    <CheckIcon className="size-4" />
                </SelectPrimitive.ItemIndicator>
            </span>
            <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
        </SelectPrimitive.Item>
    )
}

function SelectSeparator({
    className,
    ...props
}: SelectSeparatorProps) {
    return (
        <SelectPrimitive.Separator
            data-slot="select-separator"
            className={cn(selectStyles.separator, className)}
            {...props}
        />
    )
}

function SelectScrollUpButton({
    className,
    ...props
}: SelectScrollUpButtonProps) {
    return (
        <SelectPrimitive.ScrollUpButton
            data-slot="select-scroll-up-button"
            className={cn(selectStyles.scrollButton, className)}
            {...props}
        >
            <ChevronUpIcon className="size-4" />
        </SelectPrimitive.ScrollUpButton>
    )
}

function SelectScrollDownButton({
    className,
    ...props
}: SelectScrollDownButtonProps) {
    return (
        <SelectPrimitive.ScrollDownButton
            data-slot="select-scroll-down-button"
            className={cn(selectStyles.scrollButton, className)}
            {...props}
        >
            <ChevronDownIcon className="size-4" />
        </SelectPrimitive.ScrollDownButton>
    )
}

export {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectScrollDownButton,
    SelectScrollUpButton,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
}
