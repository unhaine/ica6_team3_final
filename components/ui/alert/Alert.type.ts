import * as React from "react"
import { type VariantProps } from "class-variance-authority"
import { alertVariants } from "./Alert.style"

export type AlertProps = React.ComponentProps<"div"> & VariantProps<typeof alertVariants>
export type AlertTitleProps = React.ComponentProps<"div">
export type AlertDescriptionProps = React.ComponentProps<"div">
