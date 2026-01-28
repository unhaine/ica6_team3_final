import { ComponentProps } from "react";

export interface BottomNavBarProps extends ComponentProps<"nav"> {
  /** Optional override for current path (for visual testing) */
  currentPath?: string;
}
