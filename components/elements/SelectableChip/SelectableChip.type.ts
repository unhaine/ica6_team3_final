import { ComponentProps, ReactNode } from "react";

export interface SelectableChipProps extends Omit<ComponentProps<"button">, "prefix"> {
  /** The value or label to display */
  label: string;
  /** Whether the chip is currently selected */
  selected?: boolean;
  /** Icon to show before the label (optional) */
  icon?: ReactNode;
  /** Size variant */
  size?: "sm" | "md";
}
