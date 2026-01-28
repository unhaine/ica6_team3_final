"use client";

import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { AspectRatio } from "@/components/ui/AspectRatio";
import { Badge } from "@/components/ui/Badge";
import { AvatarThumbnail } from "@/components/elements/AvatarThumbnail";
import { RatingStars } from "@/components/elements/RatingStars";
import { RecipeCardProps } from "./RecipeCard.type";
import { STYLES } from "./RecipeCard.style";

/**
 * RecipeCard Module
 * @description Card showing recipe preview with fridge match percentage.
 */
export const RecipeCard = ({
  id: _id,
  title,
  imageUrl,
  matchPercentage,
  cookingTime,
  rating = 0,
  onClick,
  className,
  ...props
}: RecipeCardProps) => {
  return (
    <Card 
        className={cn(STYLES.card, className)} 
        onClick={onClick}
        role="button"
        {...props}
    >
      <div className={STYLES.imageContainer}>
        <AspectRatio ratio={4 / 3}>
          <AvatarThumbnail 
            src={imageUrl} 
            alt={title} 
            shape="square" 
            className="w-full h-full"
            fallback={title} 
          />
        </AspectRatio>
        
        {/* Match Check Badge */}
        <Badge className={STYLES.matchBadge}>
            {matchPercentage}% 일치
        </Badge>
      </div>

      <div className={STYLES.content}>
        <div className={STYLES.title}>{title}</div>
        
        <div className={STYLES.meta}>
          <RatingStars rating={rating} size="sm" />
          
          {cookingTime && (
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{cookingTime}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
