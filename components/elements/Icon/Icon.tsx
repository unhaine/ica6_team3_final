import { LucideIcon, icons } from 'lucide-react';
import { IconProps } from './Icon.types';
import { cn } from '@/lib/utils';

export const Icon = ({ 
  name, 
  size = 24, 
  color, 
  className,
  strokeWidth = 2 
}: IconProps) => {
  const LucideIcon = icons[name] as LucideIcon;

  if (!LucideIcon) {
    return null;
  }

  return (
    <LucideIcon 
      size={size} 
      color={color} 
      strokeWidth={strokeWidth}
      className={cn("shrink-0", className)} 
    />
  );
};
