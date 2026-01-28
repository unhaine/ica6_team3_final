import { cva } from "class-variance-authority"

export const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
)

export const LABEL_STYLES = {
  root: "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
} as const;
