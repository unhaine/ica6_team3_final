"use client";

import { cn } from "@/lib/utils";
import { SelectableChip } from "@/components/elements/SelectableChip";
import { CategoryFilterProps } from "./CategoryFilter.type";
import { STYLES } from "./CategoryFilter.style";

/**
 * CategoryFilter Module
 * @description Horizontal scrollable list for filtering content by category.
 */
export const CategoryFilter = ({
  categories,
  selectedId,
  onSelect,
  className,
  ...props
}: CategoryFilterProps) => {
  return (
    <div className={cn(STYLES.scrollContainer, className)} {...props}>
      <div className={STYLES.list}>
        {categories.map((cat) => (
          <SelectableChip
            key={cat.id}
            label={cat.count !== undefined ? `${cat.label} ${cat.count}` : cat.label}
            icon={cat.icon}
            selected={selectedId === cat.id}
            onClick={() => onSelect(cat.id)}
            size="sm"
          />
        ))}
      </div>
    </div>
  );
};
