'use client';

import type { NumberInputProps } from './NumberInput.type';
import { Button, Input } from '@/components/ui';
import { Icon } from '../Icon';
import { cn } from '@/lib/utils';
import { STYLES } from './NumberInput.style';

/**
 * 숫자 입력 컴포넌트
 * @description 증감 버튼이 있는 숫자 입력 필드
 */
export const NumberInput = ({
    value,
    onChange,
    min = 0,
    max,
    step = 1,
    className,
    disabled,
}: NumberInputProps) => {
    const handleDecrement = () => {
        if (min !== undefined && value <= min) return;
        onChange(value - step);
    };

    const handleIncrement = () => {
        if (max !== undefined && value >= max) return;
        onChange(value + step);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseFloat(e.target.value);
        if (!isNaN(newValue)) {
            onChange(newValue);
        }
    };

    return (
        <div className={cn(STYLES.container, className)}>
            <Button
                variant="outline"
                size="icon"
                className={STYLES.button}
                onClick={handleDecrement}
                disabled={disabled || (min !== undefined && value <= min)}
                type="button"
            >
                <Icon name="Minus" size={14} />
            </Button>
            
            <Input
                type="number"
                value={value}
                onChange={handleInputChange}
                className={STYLES.input}
                disabled={disabled}
            />
            
            <Button
                variant="outline"
                size="icon"
                className={STYLES.button}
                onClick={handleIncrement}
                disabled={disabled || (max !== undefined && value >= max)}
                type="button"
            >
                <Icon name="Plus" size={14} />
            </Button>
        </div>
    );
};
