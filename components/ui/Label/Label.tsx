"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cn } from "@/lib/utils"
import { LABEL_STYLES } from "./Label.style"
import { LabelProps } from "./Label.type"

/**
 * 라벨 컴포넌트
 * @description 폼 요소에 이름을 붙여 가독성과 접근성을 높임
 */
const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelProps
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(LABEL_STYLES.root, className)}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
