import * as React from "react"
import { cn } from "@/lib/utils"
import { inputStyles } from "./Input.style"
import { InputProps } from "./Input.type"

/**
 * 입력 컴포넌트
 * @description 사용자로부터 텍스트 입력을 받는 기본적인 폼 요소
 */
export const Input = ({ className, type, ...props }: InputProps) => {
    return (
        <input
            type={type}
            data-slot="input"
            className={cn(inputStyles, className)}
            {...props}
        />
    )
}
