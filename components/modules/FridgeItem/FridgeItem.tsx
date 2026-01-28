"use client";

import { useMemo } from "react";
import { Badge } from "@/components/ui/Badge";
import { DataRow } from "@/components/elements/DataRow";
import { AvatarThumbnail } from "@/components/elements/AvatarThumbnail";

import { FridgeItemProps } from "./FridgeItem.type";
import { STYLES, dDayVariants } from "./FridgeItem.style";

const getDDay = (date: Date | string) => {
  const target = new Date(date);
  const today = new Date();
  
  // Reset time to compare dates only
  target.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  
  const diffTime = target.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

const getDDayState = (days: number) => {
  if (days < 0) return "expired";
  if (days <= 3) return "danger";
  if (days <= 7) return "warning";
  return "normal";
};

const formatDDay = (days: number) => {
  if (days < 0) return `+${Math.abs(days)}`;
  if (days === 0) return "D-Day";
  return `D-${days}`;
};

/**
 * FridgeItem Module
 * @description A list row representing a single item in the fridge.
 * Displays expiry status prominently.
 */
export const FridgeItem = ({
  id: _id, // unused but kept for interface consistency
  name,
  expiryDate,
  quantity,
  category,
  imageUrl,
  onClick,
  className,
  ...props
}: FridgeItemProps) => {
  const dDay = useMemo(() => getDDay(expiryDate), [expiryDate]);
  const state = getDDayState(dDay);

  return (
    <DataRow
      className={className}
      itemAction={onClick}
      left={
        <AvatarThumbnail 
            src={imageUrl} 
            alt={name} 
            fallback={name} 
            size="md" 
        />
      }
      right={
        <Badge variant="outline" className={dDayVariants({ state })}>
          {formatDDay(dDay)}
        </Badge>
      }
      {...props}
    >
      <div className={STYLES.name}>{name}</div>
      <div className={STYLES.meta}>
        {quantity} | {category || "기타"}
      </div>
    </DataRow>
  );
};
