import * as React from "react"
import { type VariantProps } from "class-variance-authority"
import { badgeVariants } from "./Badge.style"

/**
 * Badge 컴포넌트 Props
 */
export interface BadgeProps extends React.ComponentProps<"span">, VariantProps<typeof badgeVariants> {
    /** Radix Slot 사용 여부 */
    asChild?: boolean
}
