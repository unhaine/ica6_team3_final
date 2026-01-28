import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { RatingStarsProps } from "./RatingStars.type";
import { starVariants, STYLES } from "./RatingStars.style";

/**
 * RatingStars Element
 * @description A read-only star rating display using Lucide icons.
 */
export const RatingStars = ({
  rating,
  max = 5,
  size = "sm",
  className,
  ...props
}: RatingStarsProps) => {
  // Ensure rating is within bounds
  const clampedRating = Math.max(0, Math.min(rating, max));
  
  // Create an array for rendering
  const stars = Array.from({ length: max }, (_, index) => index + 1);

  return (
    <div className={cn(STYLES.container, className)} {...props} aria-label={`${rating} out of ${max} stars`}>
      {stars.map((starIndex) => {
        const isFilled = starIndex <= Math.round(clampedRating);
        return (
          <Star
            key={starIndex}
            className={cn(
               isFilled ? starVariants({ size }) : cn(starVariants({ size }), STYLES.emptyStar)
            )}
          />
        );
      })}
    </div>
  );
};
