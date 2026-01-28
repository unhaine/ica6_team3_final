export const STYLES = {
  card: "overflow-hidden group cursor-pointer transition-all hover:shadow-md border-0 bg-white shadow-sm ring-1 ring-black/5 active:scale-[0.98]",
  imageContainer: "relative w-full overflow-hidden",
  matchBadge: "absolute top-2 right-2 bg-green-500 hover:bg-green-600 text-white border-0 font-bold px-2 py-0.5 shadow-sm text-xs backdrop-blur-sm",
  content: "p-3",
  title: "font-bold text-gray-900 line-clamp-1 mb-1 group-hover:text-primary transition-colors",
  meta: "flex items-center justify-between text-xs text-gray-500",
} as const;
