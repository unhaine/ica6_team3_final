import { cva } from "class-variance-authority";

export const starVariants = cva("text-yellow-400 fill-current", {
  variants: {
    size: {
      sm: "h-3 w-3",
      md: "h-4 w-4",
    },
  },
  defaultVariants: {
    size: "sm",
  },
});

export const STYLES = {
  container: "flex items-center gap-0.5",
  emptyStar: "text-gray-200 fill-current",
} as const;
