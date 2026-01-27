'use client';

import { ActionButtonProps } from './ActionButton.type';
import { Button } from '@/components/ui';
import { Icon } from '../Icon';
import { Spinner } from '../Spinner';
import { cn } from '@/lib/utils';
import { STYLES, ICON_SIZES } from './ActionButton.style';

/**
 * 액션 버튼 컴포넌트
 * @description 아이콘과 로딩 상태를 지원하는 확장 버튼
 */
export const ActionButton = ({
    children,
    icon,
    iconPosition = 'left',
    loading = false,
    fullWidth = false,
    className,
    variant = 'default',
    size = 'default',
    disabled,
    ...props
}: ActionButtonProps) => {
    const iconSize = ICON_SIZES[size as keyof typeof ICON_SIZES] ?? ICON_SIZES.default;

    return (
        <Button
            variant={variant}
            size={size}
            disabled={disabled || loading}
            className={cn(
                STYLES.button,
                fullWidth && STYLES.fullWidth,
                className
            )}
            {...props}
        >
            {loading && (
                <Spinner size="sm" className={STYLES.iconLeft} color="inherit" />
            )}

            {!loading && icon && iconPosition === 'left' && (
                <Icon name={icon} size={iconSize} className={STYLES.iconLeft} />
            )}

            <span className={cn(loading && STYLES.loadingText)}>{children}</span>

            {!loading && icon && iconPosition === 'right' && (
                <Icon name={icon} size={iconSize} className={STYLES.iconRight} />
            )}
        </Button>
    );
};
