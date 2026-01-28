import { ComponentProps } from "react";

export interface RatingStarsProps extends ComponentProps<"div"> {
  /** Rating value (0-5) */
  rating: number;
  /** Maximum stars (default 5) */
  max?: number;
  /** Size of stars */
  size?: "sm" | "md";
}
