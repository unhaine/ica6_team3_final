"use client";

import { cn } from "@/lib/utils";
import { DataRowProps } from "./DataRow.type";
import { STYLES } from "./DataRow.style";

/**
 * DataRow Element
 * @description A generic row component with Left-Content-Right slot architecture.
 * Designed to be the foundation for all list items (Fridge, Recipes, Settings).
 */
export const DataRow = ({
  left,
  children,
  title, // ✨ Update
  subTitle, // ✨ Update
  right,
  className,
  itemAction,
  disabled = false,
  ...props
}: DataRowProps) => {
  const isClickable = !!itemAction && !disabled;

  return (
    <div
      role={isClickable ? "button" : "presentation"}
      onClick={isClickable ? itemAction : undefined}
      className={cn(
        STYLES.container(isClickable),
        disabled && STYLES.disabled,
        className
      )}
      {...props}
    >
      {left && <div className={STYLES.left}>{left}</div>}
      
      <div className={STYLES.content}>
        {title && <div className="text-sm font-semibold text-foreground leading-snug">{title}</div>}
        {subTitle && <div className="text-xs text-muted-foreground">{subTitle}</div>}
        {children}
      </div>

      {right && <div className={STYLES.right}>{right}</div>}
    </div>
  );
};
