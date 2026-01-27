import * as React from "react"
import { cn } from "@/lib/utils"
import { inputStyles } from "./Input.style"
import { InputProps } from "./Input.type"

function Input({ className, type, ...props }: InputProps) {
    return (
        <input
            type={type}
            data-slot="input"
            className={cn(inputStyles, className)}
            {...props}
        />
    )
}

export { Input }
