import { ComponentProps } from "react";

export interface AvatarThumbnailProps extends ComponentProps<"div"> {
  /** Image source URL */
  src?: string | null;
  /** Alt text for the image */
  alt?: string;
  /** Fallback characters (max 2 recommended) if image fails or is missing */
  fallback?: string;
  /** Size of the avatar */
  size?: "sm" | "md" | "lg" | "xl";
  /** Shape of the avatar */
  shape?: "circle" | "square" | "rounded";
}
