import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"
import { buttonVariants } from "./Button.style"
import { ButtonProps } from "./Button.type"

/**
 * 버튼 컴포넌트
 * @description 다양한 스타일과 크기를 지원하는 인터랙티브 버튼
 */
export const Button = ({
    className,
    variant = "default",
    size = "default",
    asChild = false,
    ...props
}: ButtonProps) => {
    const Comp = asChild ? Slot : "button"

    return (
        <Comp
            data-slot="button"
            data-variant={variant}
            data-size={size}
            className={cn(buttonVariants({ variant, size, className }))}
            {...props}
        />
    )
}

export { buttonVariants }
