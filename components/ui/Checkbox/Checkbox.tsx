"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"
import { CHECKBOX_STYLES } from "./Checkbox.style"
import { CheckboxProps } from "./Checkbox.type"

/**
 * 체크박스 컴포넌트
 * @description 선택/해제 상태를 토글하는 폼 요소
 */
const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(CHECKBOX_STYLES.root, className)}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn(CHECKBOX_STYLES.indicator)}
    >
      <Check className={cn(CHECKBOX_STYLES.icon)} />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
