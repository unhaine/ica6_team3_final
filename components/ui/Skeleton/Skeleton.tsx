import * as React from "react"
import { cn } from "@/lib/utils"
import { skeletonStyles } from "./Skeleton.style"
import { SkeletonProps } from "./Skeleton.type"

function Skeleton({ className, ...props }: SkeletonProps) {
    return (
        <div
            data-slot="skeleton"
            className={cn(skeletonStyles, className)}
            {...props}
        />
    )
}

export { Skeleton }
