import * as React from "react"
import { cn } from "@/lib/utils"
import { alertVariants } from "./Alert.style"
import { AlertProps, AlertTitleProps, AlertDescriptionProps } from "./Alert.type"

function Alert({
    className,
    variant,
    ...props
}: AlertProps) {
    return (
        <div
            data-slot="alert"
            role="alert"
            className={cn(alertVariants({ variant }), className)}
            {...props}
        />
    )
}

function AlertTitle({ className, ...props }: AlertTitleProps) {
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

function AlertDescription({
    className,
    ...props
}: AlertDescriptionProps) {
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

export { Alert, AlertTitle, AlertDescription }
