import { cn } from "@/lib/utils";

export const STYLES = {
  container: "group bg-white overflow-hidden border border-gray-100 shadow-sm active:scale-[0.99] transition-transform p-0",
  imageWrapper: (ratio: "square" | "video" | "portrait") => cn(
    "w-full bg-gray-100 relative overflow-hidden",
    ratio === "square" && "aspect-square",
    ratio === "video" && "aspect-video",
    ratio === "portrait" && "aspect-[3/4]"
  ),
  image: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500",
  overlay: "absolute top-2 right-2 flex gap-1",
  
  content: "p-4",
  header: "flex justify-between items-start mb-1",
  title: "font-bold text-gray-900 line-clamp-1 flex-1 mr-2",
  subtitle: "text-xs text-primary font-medium bg-primary/10 px-2 py-0.5 rounded shrink-0",
  description: "text-xs text-gray-500 mb-3 line-clamp-2 min-h-[2.5em]",
  
  footer: "flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-50 mt-2",
  footerLeft: "flex items-center gap-1 font-medium text-gray-600",
  footerRight: "flex gap-3",
} as const;
