import { cva } from "class-variance-authority";

export const chipVariants = cva(
  "inline-flex items-center justify-center rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-95",
  {
    variants: {
      selected: {
        true: "bg-primary text-white border-primary shadow-sm hover:bg-primary/90",
        false: "bg-surface text-text-secondary border-border hover:bg-surface-active hover:text-text-primary",
      },
      size: {
        sm: "h-7 px-3 text-xs font-medium",
        md: "h-9 px-4 text-sm font-medium",
        lg: "h-12 px-6 text-base font-semibold",
      },
    },
    defaultVariants: {
      selected: false,
      size: "md",
    },
  }
);
