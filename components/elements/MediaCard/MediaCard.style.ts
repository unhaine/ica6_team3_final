import { cn } from "@/lib/utils";

export const STYLES = {
  container: (layout: "vertical" | "horizontal" | "full", ratio: "square" | "video" | "portrait" | "auto") => cn(
    "group bg-surface overflow-hidden border border-border shadow-sm active:scale-[0.98] transition-all p-0 relative",
    layout === "horizontal" && "flex flex-row items-stretch",
    layout === "full" && "flex flex-col",
    layout === "full" && ratio === "square" && "aspect-square",
    layout === "full" && ratio === "video" && "aspect-video",
    layout === "full" && ratio === "portrait" && "aspect-[3/4]"
  ),

  imageWrapper: (ratio: "square" | "video" | "portrait" | "auto", layout: "vertical" | "horizontal" | "full") => cn(
    "bg-muted relative overflow-hidden shrink-0 transition-all duration-500",
    layout === "vertical" ? "w-full" : (layout === "full" ? "absolute inset-0 w-full h-full" : "w-28"),
    layout === "vertical" && ratio === "square" && "aspect-square",
    layout === "vertical" && ratio === "video" && "aspect-video",
    layout === "vertical" && ratio === "portrait" && "aspect-[3/4]",
    (layout === "horizontal" || layout === "full" || ratio === "auto") && "h-auto"
  ),

  image: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-700",

  overlay: "absolute top-3 right-3 flex gap-1.5 z-30",

  gradient: "absolute inset-0 bg-linear-to-b from-black/20 via-transparent via-50% to-black/80 z-10",

  content: (layout: "vertical" | "horizontal" | "full") => cn(
    "p-4 flex-1 flex flex-col overflow-visible",
    layout === "full" && "relative z-20 bg-transparent h-full justify-end"
  ),
  header: "flex justify-between items-start mb-1.5 gap-2",
  title: "font-bold text-text-primary text-sm flex-1", // Removed line-clamp for flexibility
  badge: "shrink-0",

  description: "text-xs text-text-secondary mb-2 line-clamp-3", // Increased lines for flexibility
  // Footer
  footer: "w-full flex items-center justify-between text-[10px] text-text-tertiary pt-2 border-t border-border-subtle mt-1.5",
  footerLeft: "flex items-center gap-1 font-medium text-text-secondary truncate mr-2",
  footerRight: "flex gap-2 items-center shrink-0",
} as const;
