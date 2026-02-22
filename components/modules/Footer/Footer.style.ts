export const STYLES = {
    container: "w-full bg-white border-t border-gray-100 flex items-center justify-around px-2 min-h-[70px] pb-safe transition-all duration-300",
    
    item: (isActive: boolean) => [
        "flex flex-col items-center justify-center w-full h-full pt-3 pb-2 gap-1 transition-colors relative",
        isActive ? "text-primary font-medium" : "text-gray-400 hover:text-primary",
    ].join(" "),

    icon: "h-7 w-7",
    label: "text-[10px] tracking-tight",
    
    fabContainer: "-mt-6 relative z-10",
    fab: "flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-transform hover:scale-105 active:scale-95",
    
    badge: "absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-medium text-destructive-foreground ring-2 ring-white",
} as const;
