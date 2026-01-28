import * as React from "react"
import { type VariantProps } from "class-variance-authority"
import { buttonVariants } from "./Button.style"

/**
 * Button 컴포넌트 Props
 */
export interface ButtonProps
    extends React.ComponentProps<"button">,
        VariantProps<typeof buttonVariants> {
    /** Radix Slot 사용 여부 */
    asChild?: boolean
}
