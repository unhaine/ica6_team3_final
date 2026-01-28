import * as React from "react"
import { cn } from "@/lib/utils"
import { cardStyles } from "./Card.style"
import {
    CardProps,
    CardHeaderProps,
    CardTitleProps,
    CardDescriptionProps,
    CardActionProps,
    CardContentProps,
    CardFooterProps,
} from "./Card.type"

function Card({ className, ...props }: CardProps) {
    return (
        <div
            data-slot="card"
            className={cn(cardStyles.card, className)}
            {...props}
        />
    )
}

function CardHeader({ className, ...props }: CardHeaderProps) {
    return (
        <div
            data-slot="card-header"
            className={cn(cardStyles.header, className)}
            {...props}
        />
    )
}

function CardTitle({ className, ...props }: CardTitleProps) {
    return (
        <div
            data-slot="card-title"
            className={cn(cardStyles.title, className)}
            {...props}
        />
    )
}

function CardDescription({ className, ...props }: CardDescriptionProps) {
    return (
        <div
            data-slot="card-description"
            className={cn(cardStyles.description, className)}
            {...props}
        />
    )
}

function CardAction({ className, ...props }: CardActionProps) {
    return (
        <div
            data-slot="card-action"
            className={cn(cardStyles.action, className)}
            {...props}
        />
    )
}

function CardContent({ className, ...props }: CardContentProps) {
    return (
        <div
            data-slot="card-content"
            className={cn(cardStyles.content, className)}
            {...props}
        />
    )
}

function CardFooter({ className, ...props }: CardFooterProps) {
    return (
        <div
            data-slot="card-footer"
            className={cn(cardStyles.footer, className)}
            {...props}
        />
    )
}

export {
    Card,
    CardHeader,
    CardFooter,
    CardTitle,
    CardAction,
    CardDescription,
    CardContent,
}
