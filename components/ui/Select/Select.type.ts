import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"

/** Select 루트 컴포넌트 Props */
export type SelectProps = React.ComponentProps<typeof SelectPrimitive.Root>
/** Select 그룹 컴포넌트 Props */
export type SelectGroupProps = React.ComponentProps<typeof SelectPrimitive.Group>
/** Select 값 표시 컴포넌트 Props */
export type SelectValueProps = React.ComponentProps<typeof SelectPrimitive.Value>
/** Select 트리거 컴포넌트 Props */
export interface SelectTriggerProps extends React.ComponentProps<typeof SelectPrimitive.Trigger> {
    /** 트리거 크기 */
    size?: "sm" | "default"
}
/** Select 콘텐츠 컴포넌트 Props */
export type SelectContentProps = React.ComponentProps<typeof SelectPrimitive.Content>
/** Select 라벨 컴포넌트 Props */
export type SelectLabelProps = React.ComponentProps<typeof SelectPrimitive.Label>
/** Select 아이템 컴포넌트 Props */
export type SelectItemProps = React.ComponentProps<typeof SelectPrimitive.Item>
/** Select 구분선 컴포넌트 Props */
export type SelectSeparatorProps = React.ComponentProps<typeof SelectPrimitive.Separator>
/** Select 스크롤 업 버튼 Props */
export type SelectScrollUpButtonProps = React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>
/** Select 스크롤 다운 버튼 Props */
export type SelectScrollDownButtonProps = React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>
