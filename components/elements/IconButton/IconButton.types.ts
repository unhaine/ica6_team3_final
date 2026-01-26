import { IconName } from '../Icon';

export interface IconButtonProps {
  icon: IconName;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'ghost' | 'outline' | 'default' | 'secondary';
  onClick?: () => void;
  ariaLabel: string;
  className?: string;
  disabled?: boolean;
}
