"use client";

import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { 
    Carousel, 
    CarouselContent, 
    CarouselItem 
} from "@/components/ui/CarouselView";
import { RecipeCard } from "@/components/modules/RecipeCard";
import { RecipeCarouselProps } from "./RecipeCarousel.type";
import { STYLES } from "./RecipeCarousel.style";
import { Typography } from "@/components/elements/Typography";

/**
 * RecipeCarousel Module
 * @description Horizontal scrollable list of recipe cards.
 */
export const RecipeCarousel = ({
  title = "추천 레시피",
  recipes,
  onRecipeClick,
  className,
  ...props
}: RecipeCarouselProps) => {
  return (
    <div className={cn(STYLES.container, className)} {...props}>
      <div className={STYLES.header}>
        <Typography variant="h6" weight="bold">{title}</Typography>
        <div className="flex items-center text-muted-foreground text-xs">
            더보기 <ChevronRight className="w-3 h-3" />
        </div>
      </div>

      <Carousel
        opts={{
          align: "start",
          dragFree: true,
        }}
        className="w-full"
      >
        <CarouselContent className={STYLES.carouselContent}>
          {recipes.map((recipe) => (
            <CarouselItem key={recipe.id} className={STYLES.carouselItem}>
              <RecipeCard
                {...recipe}
                onClick={() => onRecipeClick?.(recipe.id)}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};
