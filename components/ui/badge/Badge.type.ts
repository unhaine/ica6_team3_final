import * as React from "react"
import { type VariantProps } from "class-variance-authority"
import { badgeVariants } from "./Badge.style"

export type BadgeProps = React.ComponentProps<"span"> &
    VariantProps<typeof badgeVariants> & { asChild?: boolean }
