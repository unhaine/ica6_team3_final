'use client';

import { IconButtonProps } from './IconButton.type';
import { Button } from '@/components/ui';
import { Icon } from '../Icon';
import { cn } from '@/lib/utils';
import { STYLES, ICON_SIZES } from './IconButton.style';

/**
 * 아이콘 버튼 컴포넌트
 * @description 아이콘만 포함하는 원형 버튼
 */
export const IconButton = ({
    icon,
    size = 'default',
    variant = 'ghost',
    onClick,
    ariaLabel,
    className,
    disabled,
}: IconButtonProps) => {
    const iconSize = ICON_SIZES[size as keyof typeof ICON_SIZES] ?? ICON_SIZES.default;

    return (
        <Button
            variant={variant}
            size="icon"
            onClick={onClick}
            disabled={disabled}
            className={cn(STYLES.button, className)}
            aria-label={ariaLabel}
        >
            <Icon name={icon} size={iconSize} />
        </Button>
    );
};
