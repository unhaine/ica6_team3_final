import { ComponentProps } from "react";
import { FridgeItemProps } from "@/components/modules/FridgeItem";

export interface FridgeListProps extends ComponentProps<"div"> {
  items: Omit<FridgeItemProps, "onClick">[];
  onItemClick?: (id: string, item: FridgeItemProps) => void;
  emptyMessage?: string;
}
