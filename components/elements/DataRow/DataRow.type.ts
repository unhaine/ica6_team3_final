import { ComponentProps, ReactNode } from "react";

export interface DataRowProps extends Omit<ComponentProps<"div">, 'title'> {
  /** Slot for left content (e.g., Image, Checkbox, Icon) */
  left?: ReactNode;
  
  /** Main content slot (usually Title + Description) */
  children?: ReactNode;
  
  /** 
   * Title text (Alternative to children) 
   * Automatically styled as primary text.
   */
  title?: ReactNode;
  
  /** 
   * Subtitle text (Alternative to children) 
   * Automatically styled as secondary description.
   */
  subTitle?: ReactNode;

  /** Slot for right content (e.g., Action Button, Input, Arrow) */
  right?: ReactNode;
  
  /** Optional click handler for the entire row */
  itemAction?: () => void;
  
  /** Disabled state */
  disabled?: boolean;
}
