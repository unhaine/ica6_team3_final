export const STYLES = {
  container: (clickable: boolean) =>
    `flex items-center gap-3 py-3 px-1 w-full bg-surface transition-colors user-select-none ${
      clickable ? "cursor-pointer active:bg-surface-active" : ""
    }`,
  left: "flex-shrink-0 flex items-center justify-center min-w-[24px]", // Minimum width for alignment
  content: "flex-1 flex flex-col justify-center overflow-hidden gap-[2px]", // Vertical stacking for text
  right: "flex-shrink-0 flex items-center justify-end gap-2 ml-2",
  disabled: "opacity-50 pointer-events-none",
} as const;
