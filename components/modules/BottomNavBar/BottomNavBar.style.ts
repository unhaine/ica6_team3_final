export const STYLES = {
  container: "fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 flex items-center justify-around px-4 z-50 pb-[env(safe-area-inset-bottom)]",
  item: (isActive: boolean) => 
    `flex flex-col items-center justify-center gap-1 w-12 h-full transition-colors ${
      isActive ? "text-primary" : "text-gray-400 hover:text-gray-600"
    }`,
  icon: "h-6 w-6",
  label: "text-[10px] font-medium",
  fabContainer: "relative -top-5",
  fab: "h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center transition-transform active:scale-95",
} as const;
