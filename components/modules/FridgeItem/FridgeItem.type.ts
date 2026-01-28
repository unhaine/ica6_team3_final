import { ComponentProps } from "react";

export interface FridgeItemProps extends ComponentProps<"div"> {
  id: string;
  name: string;
  expiryDate: Date | string; // Supporting both for flexibility
  quantity: string | number;
  category?: string;
  imageUrl?: string;
  onClick?: () => void;
}
