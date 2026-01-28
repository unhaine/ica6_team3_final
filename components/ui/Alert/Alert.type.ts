import * as React from "react"
import { type VariantProps } from "class-variance-authority"
import { alertVariants } from "./Alert.style"

/**
 * Alert 컴포넌트 Props
 */
export interface AlertProps extends React.ComponentProps<"div">, VariantProps<typeof alertVariants> {}

/**
 * Alert Title 컴포넌트 Props
 */
export type AlertTitleProps = React.ComponentProps<"div">

/**
 * Alert Description 컴포넌트 Props
 */
export type AlertDescriptionProps = React.ComponentProps<"div">
