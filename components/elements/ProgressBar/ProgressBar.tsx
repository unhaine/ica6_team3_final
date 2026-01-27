import type { ProgressBarProps } from './ProgressBar.type';
import { Progress } from '@/components/ui';
import { Typography } from '../Typography';
import { cn } from '@/lib/utils';
import { STYLES, VARIANT_STYLES } from './ProgressBar.style';

/**
 * 프로그래스 바 컴포넌트
 * @description 진행률을 시각적으로 표시하는 바
 */
export const ProgressBar = ({
    value,
    max = 100,
    showLabel = false,
    label,
    variant = 'default',
    className,
}: ProgressBarProps) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    const variantStyle = VARIANT_STYLES[variant as keyof typeof VARIANT_STYLES] ?? VARIANT_STYLES.default;

    return (
        <div className={cn(STYLES.container, className)}>
            {(showLabel || label) && (
                <div className={STYLES.labelContainer}>
                    {label && <Typography variant="caption" color="muted">{label}</Typography>}
                    {showLabel && (
                        <Typography variant="caption" weight="medium" className="ml-auto">
                            {Math.round(percentage)}%
                        </Typography>
                    )}
                </div>
            )}
            <Progress 
                value={percentage} 
                className={cn(STYLES.progress, variantStyle)} 
            />
        </div>
    );
};
