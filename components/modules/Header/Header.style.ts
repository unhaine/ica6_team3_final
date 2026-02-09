export const STYLES = {
    header: (transparent: boolean) => [
        "sticky top-0 z-50 w-full flex items-center justify-between px-4 h-16 transition-transform duration-300",
        transparent ? "bg-transparent text-white" : "bg-white text-slate-900",
    ].join(" "),
    
    leftSection: "flex items-center gap-2 min-w-10",
    centerSection: "flex-1 flex justify-center overflow-hidden",
    rightSection: "flex items-center justify-end min-w-10 gap-1",
    
    title: "truncate text-lg font-semibold",
} as const;
