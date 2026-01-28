export const CAROUSEL_STYLES = {
  root: "relative",
  contentWrapper: "overflow-hidden",
  content: "flex",
  orientation: {
    horizontal: "-ml-4",
    vertical: "-mt-4 flex-col",
  },
  item: "min-w-0 shrink-0 grow-0 basis-full",
  itemPadding: {
    horizontal: "pl-4",
    vertical: "pt-4",
  },
  button: "absolute h-8 w-8 rounded-full",
  buttonNav: {
    previous: {
      horizontal: "-left-12 top-1/2 -translate-y-1/2",
      vertical: "-top-12 left-1/2 -translate-x-1/2 rotate-90",
    },
    next: {
      horizontal: "-right-12 top-1/2 -translate-y-1/2",
      vertical: "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
    },
  },
} as const;
