import type { NumberInputProps } from './NumberInput.types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Icon } from '../Icon';
import { cn } from '@/lib/utils';

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
    <div className={cn("flex items-center gap-1", className)}>
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 rounded-full"
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
        className="h-8 w-16 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        disabled={disabled}
      />
      
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 rounded-full"
        onClick={handleIncrement}
        disabled={disabled || (max !== undefined && value >= max)}
        type="button"
      >
        <Icon name="Plus" size={14} />
      </Button>
    </div>
  );
};
