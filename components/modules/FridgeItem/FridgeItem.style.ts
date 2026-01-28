import { cva } from "class-variance-authority";

export const STYLES = {
  name: "font-semibold text-gray-900 truncate",
  meta: "text-xs text-gray-500",
} as const;

export const dDayVariants = cva("font-bold text-xs px-2 py-0.5 min-w-[3rem] justify-center", {
  variants: {
    state: {
      normal: "bg-gray-100 text-gray-600 hover:bg-gray-200 border-gray-200",
      warning: "bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200", // D-5 to D-3
      danger: "bg-red-100 text-red-700 hover:bg-red-200 border-red-200",   // D-2 to D-0
      expired: "bg-gray-800 text-white hover:bg-gray-700 border-gray-700",  // Expired
    },
  },
  defaultVariants: {
    state: "normal",
  },
});
