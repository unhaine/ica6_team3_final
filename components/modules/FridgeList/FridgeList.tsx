"use client";

import { Ghost } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/Separator";
import { Typography } from "@/components/elements/Typography";
import { FridgeItem } from "@/components/modules/FridgeItem";

import { FridgeListProps } from "./FridgeList.type";
import { STYLES } from "./FridgeList.style";

/**
 * FridgeList Module
 * @description Vertical list of fridge items.
 */
export const FridgeList = ({
  items,
  onItemClick,
  emptyMessage = "냉장고가 비어있어요.\n재료를 추가해보세요!",
  className,
  ...props
}: FridgeListProps) => {
  if (items.length === 0) {
    return (
      <div className={cn(STYLES.emptyContainer, className)} {...props}>
        <div className="bg-gray-100 p-4 rounded-full mb-4">
            <Ghost className="w-8 h-8 text-gray-400" />
        </div>
        <Typography variant="body2" className={STYLES.emptyText} align="center">
          {emptyMessage}
        </Typography>
      </div>
    );
  }

  return (
    <div className={cn(STYLES.container, className)} {...props}>
      {items.map((item, index) => (
        <div key={item.id}>
            <FridgeItem
                {...item}
                onClick={() => onItemClick?.(item.id, item)}
            />
            {index < items.length - 1 && <Separator className={STYLES.divider} />}
        </div>
      ))}
    </div>
  );
};
