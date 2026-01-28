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

/**
 * 선택 컴포넌트
 * @description 사용자에게 여러 옵션 중 하나를 선택하도록 하는 드롭다운 메뉴
 */
export const Select = ({
    ...props
}: SelectProps) => {
    return <SelectPrimitive.Root data-slot="select" {...props} />
}

/**
 * 선택 그룹
 */
export const SelectGroup = ({
    ...props
}: SelectGroupProps) => {
    return <SelectPrimitive.Group data-slot="select-group" {...props} />
}

/**
 * 선택된 값 표시
 */
export const SelectValue = ({
    ...props
}: SelectValueProps) => {
    return <SelectPrimitive.Value data-slot="select-value" {...props} />
}

/**
 * 선택 트리거
 */
export const SelectTrigger = ({
    className,
    size = "default",
    children,
    ...props
}: SelectTriggerProps) => {
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

/**
 * 선택 콘텐츠 영역
 */
export const SelectContent = ({
    className,
    children,
    position = "item-aligned",
    align = "center",
    ...props
}: SelectContentProps) => {
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

/**
 * 선택 라벨
 */
export const SelectLabel = ({
    className,
    ...props
}: SelectLabelProps) => {
    return (
        <SelectPrimitive.Label
            data-slot="select-label"
            className={cn(selectStyles.label, className)}
            {...props}
        />
    )
}

/**
 * 선택 아이템
 */
export const SelectItem = ({
    className,
    children,
    ...props
}: SelectItemProps) => {
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

/**
 * 선택 구분선
 */
export const SelectSeparator = ({
    className,
    ...props
}: SelectSeparatorProps) => {
    return (
        <SelectPrimitive.Separator
            data-slot="select-separator"
            className={cn(selectStyles.separator, className)}
            {...props}
        />
    )
}

/**
 * 상단 스크롤 버튼
 */
export const SelectScrollUpButton = ({
    className,
    ...props
}: SelectScrollUpButtonProps) => {
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

/**
 * 하단 스크롤 버튼
 */
export const SelectScrollDownButton = ({
    className,
    ...props
}: SelectScrollDownButtonProps) => {
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
