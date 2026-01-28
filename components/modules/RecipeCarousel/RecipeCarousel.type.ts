import { ComponentProps } from "react";
import { RecipeCardProps } from "@/components/modules/RecipeCard";

export interface RecipeCarouselProps extends ComponentProps<"div"> {
  title?: string;
  recipes: Omit<RecipeCardProps, "onClick">[];
  onRecipeClick?: (id: string) => void;
}
