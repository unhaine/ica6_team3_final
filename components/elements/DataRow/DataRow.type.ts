import { ComponentProps, ReactNode } from "react";

export interface DataRowProps extends ComponentProps<"div"> {
  /** Slot for left content (e.g., Image, Checkbox, Icon) */
  left?: ReactNode;
  /** Main content slot (usually Title + Description) */
  children?: ReactNode;
  /** Slot for right content (e.g., Action Button, Input, Arrow) */
  right?: ReactNode;
  /** Optional click handler for the entire row */
  itemAction?: () => void;
  /** Disabled state */
  disabled?: boolean;
}
