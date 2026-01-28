import { ComponentProps, ReactNode } from "react";

export interface IconBoxProps extends ComponentProps<"div"> {
  /** The icon node to display */
  icon: ReactNode;
  /** Size of the box */
  size?: "sm" | "md" | "lg";
  /** Shape of the box */
  shape?: "circle" | "square" | "rounded";
  /** Color theme variant */
  variant?: "primary" | "secondary" | "muted" | "outline" | "ghost";
}
