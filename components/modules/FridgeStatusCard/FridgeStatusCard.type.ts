import { ComponentProps } from "react";

export interface FridgeStatusCardProps extends ComponentProps<"div"> {
  /** Percentage of fridge capacity filled (0-100) */
  fillPercentage: number;
  /** List of names of items expiring soon */
  urgentItems?: string[];
  /** Loading state */
  loading?: boolean;
}
