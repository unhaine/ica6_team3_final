import { cn } from "@/lib/utils";

export const STYLES = {
  container: (layout: "vertical" | "horizontal") => cn(
    "group bg-white overflow-hidden border border-gray-100 shadow-sm active:scale-[0.99] transition-transform p-0",
    layout === "horizontal" && "flex flex-row items-stretch"
  ),
  
  imageWrapper: (ratio: "square" | "video" | "portrait" | "auto", layout: "vertical" | "horizontal") => cn(
    "bg-gray-100 relative overflow-hidden shrink-0",
    layout === "vertical" ? "w-full" : "w-28",
    layout === "vertical" && ratio === "square" && "aspect-square",
    layout === "vertical" && ratio === "video" && "aspect-video",
    layout === "vertical" && ratio === "portrait" && "aspect-[3/4]",
    (layout === "horizontal" || ratio === "auto") && "h-auto"
  ),
  
  // Image element style
  image: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500",
  
  // Overlay container (absolute)
  overlay: "absolute top-2 right-2 flex gap-1 z-10",
  
  // Content Body
  content: "p-3 flex-1 flex flex-col justify-between overflow-hidden",
  header: "flex justify-between items-start mb-1 gap-2",
  title: "font-bold text-gray-900 line-clamp-1 flex-1 text-sm",
  badge: "shrink-0",
  
  description: "text-xs text-gray-500 mb-2 line-clamp-2 min-h-[2.5em]",
  
  // Footer
  footer: "flex items-center justify-between text-[10px] text-gray-400 pt-2 border-t border-gray-50 mt-1",
  footerLeft: "flex items-center gap-1 font-medium text-gray-600 truncate mr-2",
  footerRight: "flex gap-2 items-center shrink-0",
} as const;
