"use client";

import { useMemo } from "react";
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
        {children}
      </div>

      {right && <div className={STYLES.right}>{right}</div>}
    </div>
  );
};
