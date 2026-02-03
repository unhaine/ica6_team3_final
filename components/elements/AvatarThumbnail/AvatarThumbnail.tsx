"use client";

import { useState } from "react";
import Image from "next/image"; // Using Next.js Image for optimization
import { cn } from "@/lib/utils";
import { AvatarThumbnailProps } from "./AvatarThumbnail.type";
import { avatarVariants, STYLES } from "./AvatarThumbnail.style";
import { User } from "lucide-react";

/**
 * AvatarThumbnail Element
 * @description A robust image wrapper with fallback support.
 * Uses Next.js Image component but handles loading errors gracefully.
 */
export const AvatarThumbnail = ({
  src,
  alt = "Thumbnail",
  fallback,
  size,
  shape,
  className,
  ...props
}: AvatarThumbnailProps) => {
  const [hasError, setHasError] = useState(false);

  const showImage = src && !hasError;

  return (
    <div className={cn(avatarVariants({ size, shape }), className)} {...props}>
      {showImage ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={STYLES.image}
          onError={() => setHasError(true)}
          unoptimized={typeof src === 'string' && src.startsWith('/uploads/')}
        />
      ) : (
        <div className={STYLES.fallback}>
          {fallback ? fallback.slice(0, 2) : <User className="h-1/2 w-1/2" />}
        </div>
      )}
    </div>
  );
};
