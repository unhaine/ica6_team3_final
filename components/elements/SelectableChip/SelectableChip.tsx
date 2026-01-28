"use client";

import { cn } from "@/lib/utils";
import { SelectableChipProps } from "./SelectableChip.type";
import { chipVariants } from "./SelectableChip.style";

/**
 * SelectableChip Element
 * @description An interactive pill-shaped button for toggling selections (Filters, Tags).
 */
export const SelectableChip = ({
  label,
  selected = false,
  icon,
  size = "md",
  className,
  type = "button",
  ...props
}: SelectableChipProps) => {
  return (
    <button
      type={type}
      aria-pressed={selected}
      className={cn(chipVariants({ selected, size }), className)}
      {...props}
    >
      {icon && <span className="mr-1.5 -ml-0.5">{icon}</span>}
      {label}
    </button>
  );
};
