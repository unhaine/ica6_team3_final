"use client"

import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"

import { cn } from "@/lib/utils"
import { SEPARATOR_STYLES } from "./Separator.style"
import { SeparatorProps } from "./Separator.type"

/**
 * 구분선 컴포넌트
 * @description 콘텐츠를 시각적으로 분리하는 직선 요소
 */
const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  SeparatorProps
>(
  (
    { className, orientation = "horizontal", decorative = true, ...props },
    ref
  ) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        SEPARATOR_STYLES.root,
        orientation === "horizontal" ? SEPARATOR_STYLES.horizontal : SEPARATOR_STYLES.vertical,
        className
      )}
      {...props}
    />
  )
)
Separator.displayName = SeparatorPrimitive.Root.displayName

export { Separator }
