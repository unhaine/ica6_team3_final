import { cva } from "class-variance-authority";

export const iconBoxVariants = cva(
  "inline-flex items-center justify-center transition-colors",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        muted: "bg-muted text-muted-foreground",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        sm: "h-8 w-8 text-xs p-1.5",
        md: "h-10 w-10 text-sm p-2",
        lg: "h-12 w-12 text-base p-2.5",
      },
      shape: {
        circle: "rounded-full",
        square: "rounded-none",
        rounded: "rounded-md",
      },
    },
    defaultVariants: {
      variant: "muted",
      size: "md",
      shape: "circle",
    },
  }
);
