import { cva } from "class-variance-authority";

export const chipVariants = cva(
  "inline-flex items-center justify-center rounded-full border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-95",
  {
    variants: {
      selected: {
        true: "bg-primary text-primary-foreground border-primary shadow-sm hover:bg-primary/90",
        false: "bg-white text-muted-foreground border-input hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        sm: "h-7 px-3 text-xs font-medium",
        md: "h-9 px-4 text-sm font-medium",
      },
    },
    defaultVariants: {
      selected: false,
      size: "md",
    },
  }
);
