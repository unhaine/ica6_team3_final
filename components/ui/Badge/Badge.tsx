import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"
import { badgeVariants } from "./Badge.style"
import { BadgeProps } from "./Badge.type"

/**
 * 배지 컴포넌트
 * @description 상태 정보나 라벨을 표시하는 소형 UI 요소
 */
export const Badge = ({
    className,
    variant = "default",
    asChild = false,
    ...props
}: BadgeProps) => {
    const Comp = asChild ? Slot : "span"

    return (
        <Comp
            data-slot="badge"
            data-variant={variant}
            className={cn(badgeVariants({ variant }), className)}
            {...props}
        />
    )
}

export { badgeVariants }
