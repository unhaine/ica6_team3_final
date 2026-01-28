import { cn } from "@/lib/utils";
import { IconBoxProps } from "./IconBox.type";
import { iconBoxVariants } from "./IconBox.style";

/**
 * IconBox Element
 * @description A consistent wrapper for icons with background shapes and colors.
 * Used for Category buttons, Feature highlights, etc.
 */
export const IconBox = ({
  icon,
  variant,
  size,
  shape,
  className,
  ...props
}: IconBoxProps) => {
  return (
    <div
      className={cn(iconBoxVariants({ variant, size, shape }), className)}
      {...props}
    >
      {icon}
    </div>
  );
};
