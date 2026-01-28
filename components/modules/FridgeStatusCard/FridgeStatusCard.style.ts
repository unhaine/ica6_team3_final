export const STYLES = {
  // Use a subtle gradient border effect using shadow or actual border
  container: "relative w-full overflow-hidden bg-white shadow-md border-0 ring-1 ring-black/5 rounded-2xl",
  header: "flex items-center justify-between pb-2",
  fillLabel: "text-sm font-medium text-gray-500",
  percentText: "text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent",
  progressContainer: "h-3 bg-gray-100 rounded-full overflow-hidden",
  indicator: "h-full bg-gradient-to-r from-blue-400 to-indigo-500 transition-all duration-1000 ease-out",
  urgentSection: "mt-4 pt-3 border-t border-gray-100",
  urgentTitle: "flex items-center gap-1.5 text-xs font-semibold text-amber-600 mb-2",
  urgentList: "flex flex-wrap gap-1.5",
  urgentBadge: "bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200 px-2 py-0.5 text-xs",
} as const;
