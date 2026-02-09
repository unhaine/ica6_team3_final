"use client";

import { FilterCarousel } from "@/components/modules";
import { SelectableChip } from "@/components/elements";
import { STYLES } from "@/components/modules/FilterCarousel/FilterCarousel.style";
import { FILTERS } from "../../../data/mock/fridge";

interface FridgeFilterProps {
  activeFilter: string;
  onFilterChange: (id: string) => void;
}

export const FridgeFilter = ({ activeFilter, onFilterChange }: FridgeFilterProps) => {
  return (
    <div className={STYLES.stickySection}>
      <FilterCarousel
        data={FILTERS}
        keyExtractor={(item: { id: string; label: string }) => item.id}
        renderItem={(filter: { id: string; label: string }) => (
          <SelectableChip
            label={filter.label}
            selected={activeFilter === filter.id}
            onClick={() => onFilterChange(filter.id)}
          />
        )}
      />
    </div>
  );
};
