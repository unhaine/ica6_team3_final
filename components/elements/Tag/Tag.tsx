'use client';

import { TagProps } from './Tag.type';
import { Badge } from '@/components/ui';
import { Icon } from '../Icon';
import { cn } from '@/lib/utils';
import { STYLES, SIZE_CLASSES, VARIANT_CLASSES, ICON_SIZES } from './Tag.style';

/**
 * 태그 컴포넌트
 * @description 라벨과 아이콘을 표시하는 태그/칩
 */
export const Tag = ({
    label,
    variant = 'default',
    size = 'md',
    icon,
    onRemove,
    className,
}: TagProps) => {
    const sizeClass = SIZE_CLASSES[size as keyof typeof SIZE_CLASSES] ?? SIZE_CLASSES.md;
    const variantClass = VARIANT_CLASSES[variant as keyof typeof VARIANT_CLASSES] ?? VARIANT_CLASSES.default;
    const iconSize = ICON_SIZES[size as keyof typeof ICON_SIZES] ?? ICON_SIZES.md;

    return (
        <Badge
            variant="outline"
            className={cn(
                STYLES.tag,
                sizeClass,
                variantClass,
                className
            )}
        >
            {icon && <Icon name={icon} size={iconSize} />}
            {label}
            {onRemove && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove();
                    }}
                    className={STYLES.removeButton}
                    aria-label="태그 삭제"
                >
                    <Icon name="X" size={12} />
                </button>
            )}
        </Badge>
    );
};
