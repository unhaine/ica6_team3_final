import { cva } from "class-variance-authority";

export const avatarVariants = cva(
  "relative flex shrink-0 overflow-hidden bg-muted",
  {
    variants: {
      size: {
        sm: "h-8 w-8 text-xs",
        md: "h-10 w-10 text-sm",
        lg: "h-14 w-14 text-base",
        xl: "h-20 w-20 text-lg",
      },
      shape: {
        circle: "rounded-full",
        square: "rounded-none",
        rounded: "rounded-md",
      },
    },
    defaultVariants: {
      size: "md",
      shape: "rounded",
    },
  }
);

export const STYLES = {
  image: "aspect-square h-full w-full object-cover",
  fallback: "flex h-full w-full items-center justify-center bg-muted text-muted-foreground font-medium uppercase",
} as const;
