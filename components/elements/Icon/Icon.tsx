import { LucideIcon, icons } from 'lucide-react';
import { IconProps } from './Icon.type';
import { cn } from '@/lib/utils';
import { STYLES, DEFAULTS } from './Icon.style';

/**
 * 아이콘 컴포넌트
 * @description Lucide 아이콘을 렌더링하는 래퍼 컴포넌트
 */
export const Icon = ({ 
    name, 
    size = DEFAULTS.size, 
    color, 
    className,
    strokeWidth = DEFAULTS.strokeWidth 
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
            className={cn(STYLES.icon, className)} 
        />
    );
};
