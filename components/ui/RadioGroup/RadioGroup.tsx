"use client"

import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { Circle } from "lucide-react"

import { cn } from "@/lib/utils"
import { RADIO_GROUP_STYLES } from "./RadioGroup.style"
import { RadioGroupProps, RadioGroupItemProps } from "./RadioGroup.type"

/**
 * 라디오 그룹 컴포넌트
 * @description 여러 옵션 중 하나를 선택할 때 사용
 */
const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  RadioGroupProps
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn(RADIO_GROUP_STYLES.root, className)}
      {...props}
      ref={ref}
    />
  )
})
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

/**
 * 라디오 아이템 컴포넌트
 */
const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioGroupItemProps
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(RADIO_GROUP_STYLES.item, className)}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className={cn(RADIO_GROUP_STYLES.indicator)}>
        <Circle className={cn(RADIO_GROUP_STYLES.icon)} />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
})
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

export { RadioGroup, RadioGroupItem }
