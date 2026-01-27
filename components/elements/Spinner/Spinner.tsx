import { SpinnerProps } from './Spinner.type';
import { cn } from '@/lib/utils';
import { STYLES, SIZE_CLASSES, COLOR_CLASSES } from './Spinner.style';

/**
 * 스피너 컴포넌트
 * @description 로딩 상태를 표시하는 원형 스피너
 */
export const Spinner = ({ 
    size = 'md', 
    color = 'primary', 
    className 
}: SpinnerProps) => {
    return (
        <div
            className={cn(
                STYLES.spinner,
                SIZE_CLASSES[size],
                COLOR_CLASSES[color],
                className
            )}
        />
    );
};
