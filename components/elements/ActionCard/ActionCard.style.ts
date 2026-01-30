import { cva } from "class-variance-authority";

export const STYLES = {
  container: cva(
    "relative flex cursor-pointer flex-col overflow-hidden transition-all duration-200 hover:shadow-md active:scale-[0.98]",
    {
      variants: {
        variant: {
          default: "bg-card border-border shadow-sm border",
          dashed: "border-2 border-dashed border-muted-foreground/30 bg-muted/30 hover:border-muted-foreground/60 hover:bg-muted/50",
          outline: "border border-border bg-transparent shadow-none hover:bg-muted/10",
          ghost: "border-none shadow-none bg-transparent hover:bg-muted/20",
        },
        disabled: {
          true: "pointer-events-none opacity-50 shadow-none",
        },
      },
      defaultVariants: {
        variant: "default",
      },
    }
  ),
} as const;
