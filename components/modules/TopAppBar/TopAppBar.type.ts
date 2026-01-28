import { ReactNode } from "react";

export interface TopAppBarProps {
  /** Optional explicit title override */
  title?: string;
  /** Force show back button */
  showBack?: boolean;
  /** Custom back action */
  onBack?: () => void;
  /** Right side action slot */
  rightAction?: ReactNode;
  /** Whether background is transparent */
  transparent?: boolean;
  /** Hide the header completely */
  hidden?: boolean;
}
