import * as React from "react"
import { cn } from "@/lib/utils"
import { alertVariants } from "./Alert.style"
import { AlertProps, AlertTitleProps, AlertDescriptionProps } from "./Alert.type"

/**
 * 경고 컴포넌트
 * @description 사용자에게 중요한 정보나 경고를 전달하는 알림 박스
 */
export const Alert = ({
    className,
    variant,
    ...props
}: AlertProps) => {
    return (
        <div
            data-slot="alert"
            role="alert"
            className={cn(alertVariants({ variant }), className)}
            {...props}
        />
    )
}

/**
 * 경고 제목
 */
export const AlertTitle = ({ className, ...props }: AlertTitleProps) => {
    return (
        <div
            data-slot="alert-title"
            className={cn(
                "col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight",
                className
            )}
            {...props}
        />
    )
}

/**
 * 경고 상세 설명
 */
export const AlertDescription = ({
    className,
    ...props
}: AlertDescriptionProps) => {
    return (
        <div
            data-slot="alert-description"
            className={cn(
                "text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed",
                className
            )}
            {...props}
        />
    )
}
