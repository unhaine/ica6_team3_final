import { ComponentProps } from "react";

export interface CorrectionItemProps extends ComponentProps<"div"> {
  id: string;
  name: string;
  quantity: string | number;
  expiryDate: string;
  onDelete?: (id: string) => void;
  onUpdate?: (id: string, field: string, value: any) => void;
}
