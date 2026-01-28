import { ComponentProps } from "react";

export interface RecipeCardProps extends ComponentProps<"div"> {
  id: string;
  title: string;
  imageUrl?: string;
  /** Percentage of ingredients user already has */
  matchPercentage: number;
  cookingTime?: string;
  // difficulty?: string; // Optional for card view, maybe too much info
  rating?: number;
  onClick?: () => void;
}
