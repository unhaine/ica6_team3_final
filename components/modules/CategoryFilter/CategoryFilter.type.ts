import { ComponentProps, ReactNode } from "react";

export interface CategoryOption {
  id: string;
  label: string;
  count?: number; // Optional count badge
  icon?: ReactNode;
}

export interface CategoryFilterProps extends Omit<ComponentProps<"div">, "onSelect"> {
  categories: CategoryOption[];
  selectedId: string;
  onSelect: (id: string) => void;
}
