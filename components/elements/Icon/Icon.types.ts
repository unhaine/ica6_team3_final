import { icons } from 'lucide-react';

export type IconName = keyof typeof icons;

export interface IconProps {
  name: IconName;
  size?: number | string;
  color?: string;
  className?: string;
  strokeWidth?: number;
}
