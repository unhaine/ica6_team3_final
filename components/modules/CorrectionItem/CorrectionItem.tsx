"use client";

import { cn } from "@/lib/utils";
import { IconButton } from "@/components/elements/IconButton";
import { Input } from "@/components/ui/Input";
import { CorrectionItemProps } from "./CorrectionItem.type";
import { STYLES } from "./CorrectionItem.style";

/**
 * CorrectionItem Module
 * @description Editable row for the scan result page.
 * Allows user to modify quantity and expiry date of detected items.
 */
export const CorrectionItem = ({
  id,
  name,
  quantity,
  expiryDate,
  onDelete,
  onUpdate,
  className,
  ...props
}: CorrectionItemProps) => {
  return (
    <div className={cn(STYLES.container, className)} {...props}>
      <div className={STYLES.header}>
        <span className={STYLES.name}>{name}</span>
        <IconButton 
            icon="X" 
            size="sm" 
            variant="ghost" 
            onClick={() => onDelete?.(id)} 
            className="text-gray-400 hover:text-red-500 hover:bg-red-50 -mr-2"
            ariaLabel="Remove item"
        />
      </div>
      
      <div className={STYLES.controls}>
         <Input 
            value={quantity} 
            onChange={(e) => onUpdate?.(id, 'quantity', e.target.value)} 
            className={STYLES.qtyInput}
            placeholder="수량"
         />
         <Input 
            type="date" 
            value={expiryDate} 
            onChange={(e) => onUpdate?.(id, 'expiryDate', e.target.value)} 
            className={STYLES.dateInput}
         />
      </div>
    </div>
  );
};
