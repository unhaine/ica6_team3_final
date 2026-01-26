import { IconName } from '../Icon';

export interface TagProps {
  label: string;
  variant?: 'default' | 'owned' | 'missing' | 'primary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: IconName;
  onRemove?: () => void;
  className?: string;
}
